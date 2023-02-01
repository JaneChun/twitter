import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { auth } from '../fbase';
import { updateCurrentUser } from 'firebase/auth';

function App() {
	const [init, setInit] = useState(false);
	const [userObj, setUserObj] = useState(null);
	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				setUserObj(user);
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
		<div>
			{init ? (
				<>
					<AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} refreshUser={refreshUser} />
					<footer>&copy; Twitter {new Date().getFullYear()}</footer>
				</>
			) : (
				<div>initializing..</div>
			)}
		</div>
	);
}

export default App;
