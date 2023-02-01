import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from 'fbase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import Tweet from 'components/Tweet';

const Home = ({ userObj }) => {
	const [tweet, setTweet] = useState('');
	const [tweets, setTweets] = useState([]);
	const [attachment, setAttachment] = useState(null);

	// 실시간으로 데이터를 데이터베이스에서 가져오기
	useEffect(() => {
		const q = query(collection(db, 'Tweets'), orderBy('createdAt', 'desc'));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const newArr = querySnapshot.docs.map((doc) => {
				return {
					...doc.data(),
					id: doc.id,
				};
			});
			setTweets(newArr);
		});
	}, []);

	// input 핸들러
	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setTweet(value); // = setTweet(e.target.value);
	};

	// 트윗 추가
	const onSubmit = async (e) => {
		e.preventDefault();
		let fileUrl = null;

		if (attachment) {
			// 파일 참조 생성
			const fileRef = ref(storage, `${userObj.email}/${uuidv4()}`);
			// 파일 업로드
			const response = await uploadString(fileRef, attachment, 'data_url');
			// 파일 다운로드
			fileUrl = await getDownloadURL(ref(storage, fileRef));
		}

		// 트윗 객체
		const tweetObj = {
			text: tweet,
			createdAt: Date.now(),
			creatorId: userObj.uid,
			fileUrl,
		};

		// 서버에 업로드
		try {
			const docRef = await addDoc(collection(db, 'Tweets'), tweetObj);
			console.log('Document written with ID: ', docRef.id);
		} catch (error) {
			console.error('Error adding document: ', error);
		}

		setTweet('');
		setAttachment(null);
	};

	const onFileChange = (e) => {
		const {
			target: { files },
		} = e;
		const file = files[0];
		const reader = new FileReader(); // reader 생성

		// reader에 onLoadEnd 이벤트 리스너 추가
		reader.onloadend = (finishedEvent) => {
			// 로딩 완료되면 실행되는 코드
			const {
				currentTarget: { result },
			} = finishedEvent;
			setAttachment(result);
		};
		reader.readAsDataURL(file);
	};

	const onClearAttachment = () => setAttachment(null);

	return (
		<>
			Home
			<form onSubmit={onSubmit}>
				<input value={tweet} onChange={onChange} type='text' placeholder="What's happening?" maxLength={120} required />
				<input onChange={onFileChange} type='file' accept='image/*' />
				<input type='submit' value='Tweet' />
				{attachment && (
					<>
						<img src={attachment} width='50px' height='50px' />
						<button onClick={onClearAttachment}>clear</button>
					</>
				)}
			</form>
			<div>
				{tweets.map((tweet) => (
					<Tweet key={tweet.id} tweetObj={tweet} isCreator={tweet.creatorId === userObj.uid} />
				))}
			</div>
		</>
	);
};

export default Home;
