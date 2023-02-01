import React, { useEffect, useState } from 'react';
import { db, storage } from 'fbase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import Tweet from 'components/Tweet';
import AddTweet from 'components/AddTweet';

const Home = ({ userObj }) => {
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

	return (
		<>
			Home
			<div>
				<AddTweet userObj={userObj} />
				{tweets.map((tweet) => (
					<Tweet key={tweet.id} tweetObj={tweet} isCreator={tweet.creatorId === userObj.uid} />
				))}
			</div>
		</>
	);
};

export default Home;
