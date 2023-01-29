import React, { useEffect, useState } from 'react';
import { db } from 'fbase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const Home = () => {
	const [tweet, setTweet] = useState('');
	const [tweets, setTweets] = useState([]);

	useEffect(() => {
		getTweets();
	}, []);

	// 트윗 불러오기
	const getTweets = async () => {
		const data = await getDocs(collection(db, 'Tweets'));
		data.forEach((doc) => {
			const tweetObject = {
				...doc.data(),
				id: doc.id,
			};
			setTweets((prev) => [tweetObject, ...prev]);
		});
	};

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
			});
			console.log('Document written with ID: ', docRef.id);
		} catch (error) {
			console.error('Error adding document: ', error);
		}

		setTweet('');
	};
	console.log(tweets);
	return (
		<>
			Home
			<form onSubmit={onSubmit}>
				<input value={tweet} onChange={onChange} type='text' placeholder="What's happening?" maxLength={120} />
				<input type='submit' value='Tweet' />
			</form>
			<div>
				{tweets.map((tweet) => {
					return (
						<div key={tweet.id}>
							<h4>{tweet.test}</h4>
							<span>{tweet.createdAt}</span>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default Home;
