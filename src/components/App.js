import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { auth } from '../fbase';

function App() {
	// console.log(authService.currentUser);
	const [init, setInit] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userObj, setUserObj] = useState(null);
	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(true);
				setUserObj(user);
			} else {
				setIsLoggedIn(false);
			}
			setInit(true);
		});
	}, []);
	return (
		<div>
			{init ? (
				<>
					<AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
					<footer>&copy; Twitter {new Date().getFullYear()}</footer>
				</>
			) : (
				<div>initializing..</div>
			)}
		</div>
	);
}

export default App;
