import React, { useEffect, useState } from 'react';
import { db, storage } from 'fbase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import Tweet from 'components/Tweet';
import AddTweet from 'components/AddTweet';
import Navigation from 'components/Navigation';
import { Icon } from '@iconify/react';

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
		<div className='flex flex-col max-h-screen justify-between'>
			<div className='py-2 border-b'>
				<Icon className='mx-auto' icon='uit:twitter-alt' fontSize='40px' />
			</div>
			<AddTweet userObj={userObj} />
			<div className='p-5 overflow-y-scroll flex-grow'>
				{tweets.map((tweet) => (
					<Tweet key={tweet.id} tweetObj={tweet} isCreator={tweet.creatorId === userObj.uid} />
				))}
			</div>
			<Navigation userObj={userObj} />
		</div>
	);
};

export default Home;
