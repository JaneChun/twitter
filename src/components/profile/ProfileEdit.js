import React, { useState } from 'react';
import { db, storage } from '../../fbase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { Icon } from '@iconify/react';

const ProfileEdit = ({ profile, setIsEditing }) => {
	const [newDisplayName, setNewDisplayName] = useState(profile.displayName); // input
	const [newBio, setNewBio] = useState(profile.bio); // input
	const [attachment, setAttachment] = useState(null);

	// input 핸들러
	const onChange = (e) => {
		const {
			target: { value, name },
		} = e;

		if (name === 'displayName') {
			setNewDisplayName(value);
		} else {
			setNewBio(value);
		}
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		let fileURL = null;
		const newProfileRef = doc(db, 'Users', profile.id);

		if (profile.displayName !== newDisplayName) {
			await updateDoc(newProfileRef, {
				displayName: newDisplayName,
			});
		}

		if (profile.bio !== newBio) {
			await updateDoc(newProfileRef, {
				bio: newBio,
			});
		}

		if (attachment) {
			// 파일 참조 생성
			const fileRef = ref(storage, `${profile.email}/profile/${uuidv4()}`);
			// 파일 업로드
			const response = await uploadString(fileRef, attachment, 'data_url');
			// 파일 다운로드
			fileURL = await getDownloadURL(ref(storage, fileRef));
			await updateDoc(newProfileRef, {
				photoURL: fileURL,
			});
		}

		setIsEditing(false);
	};

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

	console.log('profile', profile);

	return (
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
					<img className='mb-5 rounded-full w-14 h-14 object-cover' src={attachment ? attachment : profile.photoURL} />
					<label className='absolute top-4 left-3.5 cursor-pointer' htmlFor='profile-input-file'>
						<Icon icon='mdi:camera-plus-outline' fontSize='25px' color='white' />
					</label>
					<input className='hidden' id='profile-input-file' onChange={onFileChange} type='file' accept='image/*' />
				</div>

				<div className='flex-grow mr-2 py-2 px-3 border-t border-b flex'>
					<span className='font-semibold mr-14'>이름</span>
					<input
						className='focus:outline-none flex-grow'
						value={newDisplayName}
						name='displayName'
						onChange={onChange}
						type='text'
						placeholder='이름을 추가하세요.'
						required
					/>
				</div>
				<div className='flex-grow mr-2 py-2 px-3 border-b flex'>
					<span className='font-semibold mr-8'>자기소개</span>
					<input
						className='focus:outline-none flex-grow'
						value={newBio}
						name='bio'
						onChange={onChange}
						type='text'
						placeholder='프로필에 자기소개를 해보세요.'
					/>
				</div>
			</form>
		</div>
	);
};

export default ProfileEdit;
