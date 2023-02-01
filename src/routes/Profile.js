import React, { useState, useEffect } from 'react';
import { auth, db } from '../fbase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Tweet from 'components/Tweet';

const Profile = ({ userObj }) => {
	const navigate = useNavigate();
	const [myTweets, setMyTweets] = useState([]);

	useEffect(() => {
		getMyTweets();
	}, []);

	const getMyTweets = async () => {
		const q = query(collection(db, 'Tweets'), where('creatorId', '==', userObj.uid), orderBy('createdAt', 'desc'));

		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			const newArr = querySnapshot.docs.map((doc) => {
				return {
					...doc.data(),
					id: doc.id,
				};
			});
			setMyTweets(newArr);
		});
	};

	const onLogOutClick = () => {
		signOut(auth);
		navigate('/');
	};

	return (
		<>
			My Profile
			<button onClick={onLogOutClick}>Log Out</button>
			{myTweets.map((tweet) => (
				<Tweet key={tweet.id} tweetObj={tweet} isCreator={tweet.creatorId === userObj.uid} />
			))}
		</>
	);
};

export default Profile;
