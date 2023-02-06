import React, { useEffect, useState } from 'react';
import { db, storage } from 'fbase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import Tweet from 'components/Tweet';
import AddTweet from 'components/AddTweet';
import Navigation from 'components/Navigation';
import { Icon } from '@iconify/react';

const Home = ({ userObj }) => {
	const [tweets, setTweets] = useState([]);
	const [profile, setProfile] = useState(null);

	// 실시간으로 데이터를 데이터베이스에서 가져오기
	useEffect(() => {
		getTweets();
		getMyProfile();
	}, []);

	const getTweets = () => {
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
	};

	const getMyProfile = async () => {
		const q = query(collection(db, 'Users'), where('uid', '==', userObj.uid));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const data = querySnapshot.docs.map((doc) => {
				return { ...doc.data(), id: doc.id };
			});
			setProfile(...data);
		});
	};
	console.log('userObj in Home', userObj);
	return (
		<div className='h-screen flex flex-col justify-between bg-white'>
			<div className='py-2 border-b'>
				<Icon className='mx-auto' icon='uit:twitter-alt' fontSize='40px' />
			</div>
			<AddTweet profile={profile} />
			<div className='p-5 overflow-y-scroll flex-grow'>
				{tweets.map((tweet) => (
					<Tweet key={tweet.id} tweetObj={tweet} isCreator={tweet.creatorId === userObj.uid} />
				))}
			</div>
			<Navigation profile={profile} />
		</div>
	);
};

export default Home;
