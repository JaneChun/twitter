import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { auth } from '../fbase';
import { updateCurrentUser } from 'firebase/auth';
import { updateProfile } from 'firebase/auth';

function App() {
	const [init, setInit] = useState(false);
	const [userObj, setUserObj] = useState(null);
	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				setUserObj(user);
				if (!user.displayName) {
					updateProfile(user, { displayName: user.email.split('@')[0] });
				}
			} else {
				setUserObj(null);
			}
			setInit(true);
		});
	}, []);

	const refreshUser = async () => {
		await updateCurrentUser(auth, auth.currentUser);
		setUserObj(auth.currentUser);
	};
	return (
		<div className='w-screen h-screen'>
			{init ? (
				<div className='relative h-full'>
					<AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} refreshUser={refreshUser} />
				</div>
			) : (
				<div className='h-full flexjustify-center items-center text-gray-400'>Loading...</div>
			)}
		</div>
	);
}

export default App;
