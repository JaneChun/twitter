import React, { useState } from 'react';
import { db, storage } from 'fbase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { Icon } from '@iconify/react';

const AddTweet = ({ profile }) => {
	const [tweet, setTweet] = useState('');
	const [attachment, setAttachment] = useState(null);

	// input 핸들러
	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setTweet(value); // = setTweet(e.target.value);
	};

	// 트윗 추가
	const onSubmit = async (e) => {
		e.preventDefault();
		let fileURL = null;

		if (attachment) {
			// 파일 참조 생성
			const fileRef = ref(storage, `${profile.email}/${uuidv4()}`);
			// 파일 업로드
			const response = await uploadString(fileRef, attachment, 'data_url');
			// 파일 다운로드
			fileURL = await getDownloadURL(ref(storage, fileRef));
		}

		// 트윗 객체
		const tweetObj = {
			text: tweet,
			createdAt: Date.now(),
			creatorId: profile.uid,
			displayName: profile.displayName,
			photoURL: profile.photoURL,
			fileURL,
		};

		// 서버에 업로드
		try {
			const docRef = await addDoc(collection(db, 'Tweets'), tweetObj);
			console.log('Document written with ID: ', docRef.id);
		} catch (error) {
			console.error('Error adding document: ', error);
		}

		setTweet('');
		setAttachment(null);
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

	const onClearAttachment = () => setAttachment(null);

	return (
		<form className='p-5' onSubmit={onSubmit}>
			<div className='font-bold ml-1 mb-1 text-gray-700'>Tweet</div>
			<div className='relative'>
				<textarea
					className='w-full mt-1 py-2 px-3 rounded-md shadow-sm focus:outline-none resize-none border'
					rows='4'
					value={tweet}
					onChange={onChange}
					type='text'
					placeholder="What's happening?"
					maxLength={280}
					required
				/>
				<div>
					<label htmlFor='input-file'>
						{!attachment && (
							<span className='cursor-pointer'>
								<Icon icon='mdi:image-plus-outline' fontSize='20px' />
							</span>
						)}
					</label>
					<input className='hidden' id='input-file' onChange={onFileChange} type='file' accept='image/*' />
				</div>

				<input
					className='absolute px-3 py-1 rounded-md text-sm text-white hover:cursor-pointer bg-gray-900 hover:bg-gray-700 focus:hover:bg-gray-700 right-2 top-20'
					type='submit'
					value='Tweet'
				/>
			</div>
			{attachment && (
				<div className='w-16 h-16 relative group cursor-pointer'>
					<img className='rounded-lg' src={attachment} />
					<button onClick={onClearAttachment}>
						<span className='text-white hidden group-hover:block'>
							<Icon className='absolute top-1 right-0' icon='mdi:delete' fontSize='20px' />
						</span>
					</button>
				</div>
			)}
		</form>
	);
};

export default AddTweet;
