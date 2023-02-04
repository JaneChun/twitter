import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from '../routes/Home';
import Profile from '../routes/Profile';
import Auth from '../routes/Auth';

const AppRouter = ({ isLoggedIn, userObj, refreshUser }) => {
	return (
		<HashRouter>
			<Routes>
				{isLoggedIn ? (
					<>
						<Route exact path='/' element={<Home userObj={userObj} />} />
						<Route expact path='/profile' element={<Profile userObj={userObj} refreshUser={refreshUser} />} />
					</>
				) : (
					<Route exact path='/' element={<Auth />} />
				)}
			</Routes>
		</HashRouter>
	);
};

export default AppRouter;
