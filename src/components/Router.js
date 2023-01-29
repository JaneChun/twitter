import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from '../routes/Home';
import Auth from '../routes/Auth';

const AppRouter = ({ isLoggedIn }) => {
	return (
		<HashRouter>
			<Routes>{isLoggedIn ? <Route exact path='/' element={<Home />} /> : <Route exact path='/' element={<Auth />} />}</Routes>
		</HashRouter>
	);
};

export default AppRouter;
