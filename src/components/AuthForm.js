import React, { useState } from 'react';
import { auth } from '../fbase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const AuthForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [newAccount, setNewAccount] = useState(false);
	const [error, setError] = useState('');

	// input 핸들러
	const onChange = (e) => {
		const {
			target: { name, value },
		} = e;
		if (name === 'email') {
			setEmail(value);
		} else {
			setPassword(value);
		}
	};

	// 로그인
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			let user;
			// 신규 사용자 등록
			if (newAccount) {
				user = await createUserWithEmailAndPassword(auth, email, password);
				// 기존 사용자 로그인
			} else {
				user = await signInWithEmailAndPassword(auth, email, password);
			}
			console.log('user', user);
		} catch (error) {
			setError(error.message);
		}
	};

	// sign in / create 토글
	const toggleAccount = () => setNewAccount((prev) => !prev);

	return (
		<>
			<form onSubmit={onSubmit}>
				<input name='email' type='text' placeholder='Email' required value={email} onChange={onChange} />
				<input name='password' type='password' placeholder='Password' required value={password} onChange={onChange} />
				<input type='submit' value={newAccount ? 'Create Account' : 'Sign In'} />
				{error}
			</form>
			<span onClick={toggleAccount}>{newAccount ? 'Sign In' : 'Create Account'}</span>
		</>
	);
};

export default AuthForm;
