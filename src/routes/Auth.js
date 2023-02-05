import React from 'react';
import { signInWithRedirect, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { auth } from '../fbase';
import AuthForm from 'components/AuthForm';
import { Icon } from '@iconify/react';

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
		} else {
			provider = new GithubAuthProvider();
			provider.addScope('profile');
			provider.addScope('email');
		}
		const user = await signInWithRedirect(auth, provider);
	};

	return (
		<>
			<div className='p-10 h-screen relative'>
				<div className='my-5 flex-col text-center font-bold text-3xl'>
					<span>
						<Icon className='mx-auto mb-5' icon='uit:twitter-alt' fontSize='40px' />
					</span>
					<h1>Gwitter</h1>
				</div>
				<AuthForm />
				<div>
					<button
						className='flex justify-center my-3 w-full bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300'
						onClick={onSocialClick}
						name='google'
					>
						<span className='my-1 mr-1.5'>
							<Icon icon='flat-color-icons:google' />
						</span>
						<span>Continue with Google</span>
					</button>
					<button
						className='flex justify-center my-3 w-full bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300'
						onClick={onSocialClick}
						name='github'
					>
						<span className='my-1 mr-2'>
							<Icon icon='skill-icons:github-dark' />
						</span>
						<span>Continue with Github</span>
					</button>
				</div>
			</div>
			<footer className='absolute bottom-3 block w-full text-center text-xs text-gray-400'>&copy; Gwitter {new Date().getFullYear()}</footer>
		</>
	);
};

export default Auth;
