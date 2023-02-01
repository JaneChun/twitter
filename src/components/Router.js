import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from '../routes/Home';
import Profile from '../routes/Profile';
import Auth from '../routes/Auth';
import Navigation from './Navigation';

const AppRouter = ({ isLoggedIn, userObj }) => {
	return (
		<HashRouter>
			{isLoggedIn && <Navigation />}
			<Routes>
				{isLoggedIn ? (
					<>
						<Route exact path='/' element={<Home userObj={userObj} />} />
						<Route expact path='/profile' element={<Profile userObj={userObj} />} />
					</>
				) : (
					<Route exact path='/' element={<Auth />} />
				)}
			</Routes>
		</HashRouter>
	);
};

export default AppRouter;
