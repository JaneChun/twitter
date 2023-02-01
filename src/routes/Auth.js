import React from 'react';
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { auth } from '../fbase';
import AuthForm from 'components/AuthForm';

const Auth = () => {
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
		const user = await signInWithPopup(auth, provider);
	};

	return (
		<div>
			<AuthForm />
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
