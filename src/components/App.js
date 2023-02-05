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
					if (user.email) {
						updateProfile(user, { displayName: user.email.split('@')[0] });
					} else {
						updateProfile(user, { displayName: user.reloadUserInfo.screenName });
					}
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
		<div className='w-full h-screen md:w-2/3 lg:w-1/2 xl:w-1/3'>
			{init ? (
				<div>
					<AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} refreshUser={refreshUser} />
				</div>
			) : (
				<div className='h-full flexjustify-center items-center text-gray-400'>Loading...</div>
			)}
		</div>
	);
}

export default App;
