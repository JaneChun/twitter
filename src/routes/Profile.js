import React from 'react';
import { auth } from '../fbase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
	const navigate = useNavigate();
	const onLogOutClick = () => {
		signOut(auth);
		navigate('/');
	};

	return (
		<>
			My Profile
			<button onClick={onLogOutClick}>Log Out</button>
		</>
	);
};

export default Profile;
