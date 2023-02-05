import React, { useState, useEffect } from 'react';
import { auth, db } from '../fbase';
import { signOut, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Tweet from 'components/Tweet';
import Navigation from 'components/Navigation';
import { checkSVG } from 'components/Tweet';
import { Icon } from '@iconify/react';
import emptyImg from '../images/empty-profile.jpeg';

const Profile = ({ userObj, refreshUser }) => {
	const navigate = useNavigate();
	const [myTweets, setMyTweets] = useState([]);
	const [isEditing, setIsEditing] = useState(false); // 편집
	const [newNickname, setNewNickname] = useState(userObj.displayName); // input
	const [selected, setSelected] = useState('tweet');

	useEffect(() => {
		getMyTweets();
	}, []);

	const getMyTweets = async () => {
		const q = query(collection(db, 'Tweets'), where('creatorId', '==', userObj.uid), orderBy('createdAt', 'desc'));

		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			const newArr = querySnapshot.docs.map((doc) => {
				return {
					...doc.data(),
					id: doc.id,
				};
			});
			setMyTweets(newArr);
		});
	};

	// input 핸들러
	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setNewNickname(value);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		if (userObj.displayName !== newNickname) {
			await updateProfile(userObj, { displayName: newNickname });
			refreshUser();
		}

		setIsEditing(false);
	};

	const toggleEditing = () => setIsEditing((prev) => !prev);

	const onLogOutClick = () => {
		signOut(auth);
		navigate('/');
	};

	const creationTime = new Date(userObj.metadata.creationTime);

	return (
		<div className='flex flex-col h-full justify-between'>
			{/* 헤더 */}
			<div className='py-2 border-b'>
				<Icon onClick={() => navigate('/')} className='mx-auto hover:cursor-pointer' icon='uit:twitter-alt' fontSize='40px' />
			</div>
			{/* 프로필 */}
			<div className='p-5 flex'>
				{/* LEFT BOX */}
				<div className='flex-grow'>
					<img className='rounded-full w-14' src={userObj.photoURL ? userObj.photoURL : emptyImg} />
					{isEditing ? (
						<form className='mt-2 flex justify-between items-center' onSubmit={onSubmit}>
							<input
								className='flex-grow mr-2 py-2 px-3 rounded-md shadow-sm focus:outline-none resize-none border'
								value={newNickname}
								onChange={onChange}
								type='text'
								placeholder='Edit your Nickname'
								required
							/>
							<input
								className='px-3 py-2 rounded-md text-sm text-gray-600 hover:cursor-pointer bg-gray-100 hover:bg-gray-200 focus:hover:bg-gray-200'
								type='submit'
								value='수정'
							/>
						</form>
					) : (
						<>
							<div className='flex'>
								<h4 className='my-2 font-semibold text-xl'>{userObj.displayName}</h4>
								{userObj.photoURL && <div className='w-4 ml-1 my-auto'>{checkSVG}</div>}
							</div>
							<div className='text-xs text-gray-400 flex'>
								<Icon className='my-auto mr-1' icon='material-symbols:calendar-month-outline' />
								<div>
									{creationTime.getFullYear()}년 {creationTime.getMonth()}월에 가입함
								</div>
							</div>
						</>
					)}
				</div>
				{!isEditing && (
					<div className='flex flex-col justify-center'>
						<button className='mb-2 px-3 py-1 rounded-full text-sm border hover:bg-gray-100 focus:bg-gray-100' onClick={toggleEditing}>
							프로필 수정
						</button>
						<button className='px-3 py-1 rounded-full text-sm border hover:bg-gray-100 focus:bg-gray-100' onClick={onLogOutClick}>
							로그아웃
						</button>
					</div>
				)}
			</div>

			<nav className='flex text-sm text-gray-500 font-semibold justify-between border-b cursor-pointer'>
				<div
					className={selected === 'tweet' ? 'p-1 border-b-4 border-gray-800 flex-1 text-center' : 'p-1 flex-1 text-center'}
					onClick={() => setSelected('tweet')}
				>
					트윗
				</div>
				<div
					className={selected === 'media' ? 'p-1 border-b-4 border-gray-800 flex-1 text-center' : 'p-1 flex-1 text-center'}
					onClick={() => setSelected('media')}
				>
					미디어
				</div>
				<div
					className={selected === 'like' ? 'p-1 border-b-4 border-gray-800 flex-1 text-center' : 'p-1 flex-1 text-center'}
					onClick={() => setSelected('like')}
				>
					마음에 들어요
				</div>
			</nav>

			<div className='overflow-y-scroll flex-grow p-5'>
				{myTweets.map((tweet) => (
					<Tweet key={tweet.id} tweetObj={tweet} isCreator={tweet.creatorId === userObj.uid} />
				))}
			</div>
			<Navigation userObj={userObj} />
		</div>
	);
};

export default Profile;
