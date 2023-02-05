import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../fbase';
import { signOut, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
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
	const [attachment, setAttachment] = useState(null);

	useEffect(() => {
		getMyTweets();
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

	// input 핸들러
	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setNewNickname(value);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		let fileUrl = null;
		if (userObj.displayName !== newNickname) {
			await updateProfile(userObj, { displayName: newNickname });
		}
		if (attachment) {
			// 파일 참조 생성
			const fileRef = ref(storage, `${userObj.email}/profile/${uuidv4()}`);
			// 파일 업로드
			const response = await uploadString(fileRef, attachment, 'data_url');
			// 파일 다운로드
			fileUrl = await getDownloadURL(ref(storage, fileRef));
			await updateProfile(userObj, { photoURL: fileUrl });
		}

		refreshUser();
		setIsEditing(false);
	};

	const toggleEditing = () => setIsEditing((prev) => !prev);

	const onLogOutClick = () => {
		signOut(auth);
		navigate('/');
	};

	const creationTime = new Date(userObj.metadata.creationTime);

	const onFileChange = (e) => {
		const {
			target: { files },
		} = e;
		const file = files[0];
		const reader = new FileReader(); // reader 생성

		// reader에 onLoadEnd 이벤트 리스너 추가
		reader.onloadend = (finishedEvent) => {
			// 로딩 완료되면 실행되는 코드
			const {
				currentTarget: { result },
			} = finishedEvent;
			setAttachment(result);
		};
		reader.readAsDataURL(file);
	};

	return (
		<div className='h-screen flex flex-col justify-between bg-white'>
			{/* HEADER */}
			<div className='py-2 border-b'>
				<Icon onClick={() => navigate('/')} className='mx-auto hover:cursor-pointer' icon='uit:twitter-alt' fontSize='40px' />
			</div>

			{/* PROFILE */}
			<div className='p-5 flex'>
				{isEditing ? (
					<div className='flex-grow'>
						<form className='text-sm flex flex-col' onSubmit={onSubmit}>
							<div className='flex justify-between mb-3'>
								<button
									className='px-2 py-1 rounded-md text-sm text-gray-600 hover:bg-gray-100 focus:hover:bg-gray-100'
									onClick={() => setIsEditing(false)}
								>
									취소
								</button>
								<div className='font-semibold'>프로필 수정</div>
								<button className='px-2 py-1 rounded-md text-sm text-gray-600 hover:bg-gray-100 focus:hover:bg-gray-100' type='submit'>
									저장
								</button>
							</div>

							<div className='relative'>
								<img
									className='mb-5 rounded-full w-14 h-14 object-cover'
									src={attachment ? attachment : userObj.photoURL ? userObj.photoURL : emptyImg}
								/>
								<label className='absolute top-4 left-3.5 cursor-pointer' htmlFor='profile-input-file'>
									<Icon icon='mdi:camera-plus-outline' fontSize='25px' color='white' />
								</label>
								<input className='hidden' id='profile-input-file' onChange={onFileChange} type='file' accept='image/*' />
							</div>

							<div className='flex-grow mr-2 py-2 px-3 border-t border-b'>
								<span className='font-semibold mr-14'>이름</span>
								<input
									className='font-bold focus:outline-none'
									value={newNickname}
									onChange={onChange}
									type='text'
									placeholder='Edit your Nickname'
									required
								/>
							</div>
							<div className='flex-grow mr-2 py-2 px-3 border-b'>
								<span className='font-semibold mr-8'>자기소개</span>
								<span className='text-gray-400'>준비중 🛠</span>
							</div>
						</form>
					</div>
				) : (
					<>
						<div className='flex-grow'>
							<img className='rounded-full w-14 h-14 object-cover' src={userObj.photoURL ? userObj.photoURL : emptyImg} />
							<div className='flex'>
								<h4 className='my-2 font-semibold text-xl'>{userObj.displayName}</h4>
								{userObj.photoURL && <div className='w-4 ml-1 my-auto'>{checkSVG}</div>}
							</div>
							<div className='text-xs text-gray-400 flex'>
								<Icon className='my-auto mr-1' icon='material-symbols:calendar-month-outline' />
								<div>{creationTime && `${creationTime.getFullYear()}년 ${creationTime.getMonth()}월에 가입함`}</div>
							</div>
						</div>
					</>
				)}

				{/* EDIT, LOGOUT BUTTONS */}
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

			{selected === 'tweet' ? (
				<div className='overflow-y-scroll flex-grow p-5'>
					{myTweets.map((tweet) => (
						<Tweet key={tweet.id} tweetObj={tweet} isCreator={tweet.creatorId === userObj.uid} />
					))}
				</div>
			) : selected === 'media' ? (
				<div className='overflow-y-scroll flex-grow p-5'>
					{myTweets
						.filter((tweet) => tweet.fileUrl)
						.map((tweet) => (
							<Tweet key={tweet.id} tweetObj={tweet} isCreator={tweet.creatorId === userObj.uid} />
						))}
				</div>
			) : (
				<div className='overflow-y-scroll flex-grow p-5 flex justify-center items-center text-gray-400'>준비중 🛠</div>
			)}

			<Navigation userObj={userObj} />
		</div>
	);
};

export default Profile;
