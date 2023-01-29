import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { auth } from '../fbase';

const Auth = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [newAccount, setNewAccount] = useState(true);
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
			let data;
			// 신규 사용자 등록
			if (newAccount) {
				const data = await createUserWithEmailAndPassword(auth, email, password);
				// 기존 사용자 로그인
			} else {
				const data = await signInWithEmailAndPassword(auth, email, password);
			}
			console.log('data', data);
		} catch (error) {
			setError(error.message);
		}
	};

	// sign in / create 토글
	const toggleAccount = () => setNewAccount((prev) => !prev);

	// 소셜 로그인
	const onSocialClick = async (e) => {
		const {
			target: { name },
		} = e;
		let provider;
		if (name === 'google') {
			// Creates the provider object.
			provider = new GoogleAuthProvider();
			provider.addScope('profile');
			provider.addScope('email');
		} else if (name === 'github') {
			provider = new GithubAuthProvider();
			provider.addScope('repo');
		}
		const data = await signInWithPopup(auth, provider);
		console.log('data', data);
	};

	return (
		<div>
			<form onSubmit={onSubmit}>
				<input name='email' type='text' placeholder='Email' required value={email} onChange={onChange} />
				<input name='password' type='password' placeholder='Password' required value={password} onChange={onChange} />
				<input type='submit' value={newAccount ? 'Create Account' : 'Sign In'} />
				{error}
			</form>
			<span onClick={toggleAccount}>{newAccount ? 'Sign In' : 'Create Account'}</span>
			<div>
				<button onClick={onSocialClick} name='google'>
					Continue with Google
				</button>
				<button onClick={onSocialClick} name='github'>
					Continue with Github
				</button>
			</div>
		</div>
	);
};

export default Auth;
