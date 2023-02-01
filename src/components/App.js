import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { auth } from '../fbase';

function App() {
	// console.log(authService.currentUser);
	const [init, setInit] = useState(false);
	const [userObj, setUserObj] = useState(null);
	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				setUserObj(user);
			}
			setInit(true);
		});
	}, []);
	return (
		<div>
			{init ? (
				<>
					<AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} />
					<footer>&copy; Twitter {new Date().getFullYear()}</footer>
				</>
			) : (
				<div>initializing..</div>
			)}
		</div>
	);
}

export default App;
