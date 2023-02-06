import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { auth } from '../fbase';
import { doc, setDoc } from 'firebase/firestore';

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

	return (
		<div className='w-full h-screen md:w-2/3 lg:w-1/2 xl:w-1/3 xl:max-w-3xl'>
			{init ? (
				<div>
					<AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} />
				</div>
			) : (
				<div className='h-full flexjustify-center items-center text-gray-400'>Loading...</div>
			)}
		</div>
	);
}

export default App;
