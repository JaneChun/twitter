import React, { useState, useEffect } from 'react';
import { auth, db } from '../fbase';
import { signOut, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Tweet from 'components/Tweet';

const Profile = ({ userObj, refreshUser }) => {
	const navigate = useNavigate();
	const [myTweets, setMyTweets] = useState([]);
	const [isEditing, setIsEditing] = useState(false); // 편집
	const [newNickname, setNewNickname] = useState(userObj.displayName); // input

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

	// input 핸들러
	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setNewNickname(value);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		if (userObj.displayName !== newNickname) {
			await updateProfile(userObj, { displayName: newNickname });
			refreshUser();
		}

		setIsEditing(false);
	};

	const toggleEditing = () => setIsEditing((prev) => !prev);

	const onLogOutClick = () => {
		signOut(auth);
		navigate('/');
	};

	return (
		<>
			My Profile
			<button onClick={onLogOutClick}>Log Out</button>
			{isEditing ? (
				<form onSubmit={onSubmit}>
					<input value={newNickname} onChange={onChange} type='text' placeholder='Edit your Nickname' required />
					<input type='submit' value='edit' />
				</form>
			) : (
				<div>
					{userObj.displayName}
					<button onClick={toggleEditing}>Edit Nickname</button>
				</div>
			)}
			{myTweets.map((tweet) => (
				<Tweet key={tweet.id} tweetObj={tweet} isCreator={tweet.creatorId === userObj.uid} />
			))}
		</>
	);
};

export default Profile;
