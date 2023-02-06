import React, { useState, useEffect } from 'react';
import { auth, db } from '../fbase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import Tweet from 'components/Tweet';
import Navigation from 'components/Navigation';
import { checkSVG } from 'components/Tweet';
import { Icon } from '@iconify/react';
import ProfileNav from 'components/profile/ProfileNav';
import ProfileEdit from 'components/profile/ProfileEdit';

const Profile = ({ userObj }) => {
	const navigate = useNavigate();
	const [myTweets, setMyTweets] = useState([]);
	const [profile, setProfile] = useState(null);
	const [isEditing, setIsEditing] = useState(false); // 편집
	const [selected, setSelected] = useState(0);

	useEffect(() => {
		getMyTweets();
		getMyProfile();
	}, []);

	// 실시간으로 데이터를 데이터베이스에서 가져오기
	const getMyTweets = async () => {
		const q = query(collection(db, 'Tweets'), where('creatorId', '==', userObj.uid), orderBy('createdAt', 'desc'));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const newArr = querySnapshot.docs.map((doc) => {
				return {
					...doc.data(),
					id: doc.id,
				};
			});
			setMyTweets(newArr);
		});
	};

	const getMyProfile = async () => {
		const q = query(collection(db, 'Users'), where('uid', '==', userObj.uid));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const data = querySnapshot.docs.map((doc) => {
				return { ...doc.data(), id: doc.id };
			});
			setProfile(...data);
		});
	};

	const toggleEditing = () => setIsEditing((prev) => !prev);

	const onLogOutClick = () => {
		signOut(auth);
		navigate('/');
	};

	const creationTime = new Date(profile?.createdAt);

	return (
		<>
			{profile && (
				<div className='h-screen flex flex-col justify-between bg-white'>
					{/* HEADER */}
					<div className='py-2 border-b'>
						<Icon onClick={() => navigate('/')} className='mx-auto hover:cursor-pointer' icon='uit:twitter-alt' fontSize='40px' />
					</div>

					{/* PROFILE */}
					<div className='p-5 flex'>
						{isEditing ? (
							<ProfileEdit profile={profile} setIsEditing={setIsEditing} />
						) : (
							<div className='flex-grow'>
								<img className='rounded-full w-14 h-14 object-cover' src={profile.photoURL} />
								<div className='flex'>
									<h4 className='my-2 font-semibold text-xl'>{profile.displayName}</h4>
									{profile.photoURL && <div className='w-4 ml-1 my-auto'>{checkSVG}</div>}
								</div>
								<div className='text-sm mb-2'>{profile.bio}</div>
								<div className='text-xs text-gray-400 flex'>
									<Icon className='my-auto mr-1' icon='material-symbols:calendar-month-outline' />
									<div>{creationTime && `${creationTime.getFullYear()}년 ${creationTime.getMonth()}월에 가입함`}</div>
								</div>
							</div>
						)}

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

					<ProfileNav selected={selected} setSelected={setSelected} />

					{selected === 0 ? (
						<div className='overflow-y-scroll flex-grow p-5'>
							{myTweets.map((tweet) => (
								<Tweet key={tweet.id} tweetObj={tweet} isCreator={tweet.creatorId === profile.uid} />
							))}
						</div>
					) : selected === 1 ? (
						<div className='overflow-y-scroll flex-grow p-5'>
							{myTweets
								.filter((tweet) => tweet.fileURL)
								.map((tweet) => (
									<Tweet key={tweet.id} tweetObj={tweet} isCreator={tweet.creatorId === profile.uid} />
								))}
						</div>
					) : (
						<div className='overflow-y-scroll flex-grow p-5 flex justify-center items-center text-gray-400'>준비중 🛠</div>
					)}

					<Navigation profile={profile} />
				</div>
			)}
		</>
	);
};

export default Profile;
