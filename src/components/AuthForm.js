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
			<form className='w-full flex-col ' onSubmit={onSubmit}>
				<div className='w-full'>
					<label className='pl-1 block text-gray-700' htmlFor='email'>
						Email
					</label>
					<input
						className='w-full my-5 px-4 py-3 rounded-lg bg-slate-100 mt-2 border focus:border-gray-500 focus:bg-white focus:outline-none'
						name='email'
						type='text'
						placeholder='Email'
						required
						value={email}
						onChange={onChange}
					/>
				</div>
				<div>
					<label className='pl-1 block text-gray-700' htmlFor='password'>
						Password
					</label>
					<input
						className='w-full my-5 px-4 py-3 rounded-lg bg-slate-100 mt-2 border focus:border-gray-500 focus:bg-white focus:outline-none'
						name='password'
						type='password'
						placeholder='Password'
						required
						value={password}
						onChange={onChange}
					/>
				</div>
				<input
					className='hover:cursor-pointer w-full block bg-gray-900 hover:bg-gray-700 focus:hover:bg-gray-700 text-white font-semibold rounded-lg
              px-4 py-3 mt-6'
					type='submit'
					value={newAccount ? 'Create Account' : 'Log In'}
				/>
				<div className='mt-1 text-center text-red-500 text-sm'>{error && error.split('auth/')[1].slice(0, -2)}</div>
			</form>
			<div
				className='hover:cursor-pointer py-2 text-center text-sm font-semibold text-gray-700 hover:text-gray-900 focus:text-gray-900'
				onClick={toggleAccount}
			>
				{newAccount ? 'Already have an account?' : 'Create Account'}
			</div>
		</>
	);
};

export default AuthForm;
