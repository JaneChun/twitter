import React, { useEffect, useState } from 'react';
import { db } from 'fbase';
import { collection, addDoc, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';
import Tweet from 'components/Tweet';

const Home = ({ userObj }) => {
	const [tweet, setTweet] = useState('');
	const [tweets, setTweets] = useState([]);

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
		try {
			const docRef = await addDoc(collection(db, 'Tweets'), {
				text: tweet,
				createdAt: Date.now(),
				creatorId: userObj.uid,
			});
			console.log('Document written with ID: ', docRef.id);
		} catch (error) {
			console.error('Error adding document: ', error);
		}

		setTweet('');
	};
	console.log('tweets', tweets);
	return (
		<>
			Home
			<form onSubmit={onSubmit}>
				<input value={tweet} onChange={onChange} type='text' placeholder="What's happening?" maxLength={120} />
				<input type='submit' value='Tweet' />
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
