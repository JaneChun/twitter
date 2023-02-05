import React, { useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from 'fbase';
import { ref, deleteObject } from 'firebase/storage';
import { Icon } from '@iconify/react';
import emptyImg from '../images/empty-profile.jpeg';

const Tweet = ({ tweetObj, isCreator }) => {
	const [isEditing, setIsEditing] = useState(false); // 편집
	const [newTweet, setNewTweet] = useState(tweetObj.text); // input
	const [isModalOpen, setIsModalOpen] = useState(false); // ... 클릭

	const newTweetRef = doc(db, 'Tweets', tweetObj.id);

	const toggleEditing = () => setIsEditing((prev) => !prev);
	const toggleModal = () => setIsModalOpen((prev) => !prev);

	// input 핸들러
	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setNewTweet(value);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		await updateDoc(newTweetRef, {
			text: newTweet,
		});
		setIsEditing(false);
		setIsModalOpen(false);
	};

	const onDeleteClick = async () => {
		const ok = window.confirm('이 트윗을 삭제하시겠습니까?');

		if (ok) {
			try {
				// db에서 트윗 삭제
				await deleteDoc(newTweetRef);
				if (tweetObj.fileUrl) {
					// storage에서 이미지 파일 삭제
					const desertRef = ref(storage, tweetObj.fileUrl);
					await deleteObject(desertRef);
					setIsModalOpen(false);
				}
			} catch (err) {
				window.alert('트윗을 삭제하는 데 실패했습니다.');
			}
		}
	};

	const cancelEdit = () => {
		setIsEditing(false);
		setIsModalOpen(false);
	};
	console.log(tweetObj);
	return (
		<div className='border-b last-of-type:border-none' key={tweetObj.id}>
			{isEditing ? (
				<>
					{isCreator && (
						<div className='flex'>
							{/* LEFT BOX */}
							<div className='p-2'>
								<img className='rounded-full w-10' src={tweetObj.photoURL ? tweetObj.photoURL : emptyImg} />
							</div>

							{/* RIGHT BOX */}
							<div className='p-2 flex flex-col flex-grow'>
								{/* BODY */}
								<form onSubmit={onSubmit}>
									<textarea
										className='w-full mt-1 py-2 px-3 rounded-md shadow-sm focus:outline-none resize-none border'
										value={newTweet}
										onChange={onChange}
										type='text'
										placeholder='Edit your tweet'
										required
									/>

									<div className='mt-2 flex justify-end'>
										<button
											className='mr-1 px-2 py-1 rounded-md text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 focus:hover:bg-gray-200'
											type='submit'
										>
											수정
										</button>
										<button
											className='px-2 py-1 rounded-md text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 focus:hover:bg-gray-200'
											onClick={cancelEdit}
										>
											취소
										</button>
									</div>
								</form>
							</div>
						</div>
					)}
				</>
			) : (
				<div className='flex'>
					{/* LEFT BOX */}
					<div className='p-2 flex-none'>
						<img className='rounded-full w-10' src={tweetObj.photoURL ? tweetObj.photoURL : emptyImg} />
					</div>

					{/* RIGHT BOX */}
					<div className='p-2 flex flex-col flex-grow'>
						{/* NAME, EDIT BUTTON */}
						<div className='flex justify-between'>
							<div className='my-1 flex'>
								<h4 className='font-semibold text-md'>{tweetObj.displayName}</h4>
								{tweetObj.photoURL && <div className='w-4 ml-1 my-auto'>{checkSVG}</div>}
							</div>

							{isCreator && (
								<div className='relative'>
									<button className='cursor-pointer' onClick={toggleModal}>
										<Icon icon='mdi:dots-horizontal' fontSize='20px' />
									</button>
									{isModalOpen && (
										<div className='z-10 overflow-hidden absolute top-5 right-0 flex flex-col rounded-lg bg-white border border-gray-300'>
											<button className='hover:bg-gray-100 py-2 px-3 text-sm whitespace-nowrap' onClick={toggleEditing}>
												트윗 수정하기
											</button>
											<button className='hover:bg-gray-100 py-2 px-3 border-t text-sm whitespace-nowrap' onClick={onDeleteClick}>
												트윗 삭제하기
											</button>
										</div>
									)}
								</div>
							)}
						</div>

						{/* BODY */}
						<div className='my-1'>{tweetObj.text}</div>
						{tweetObj.fileUrl && (
							<div>
								<img className='rounded-xl h-64 w-full object-cover' src={tweetObj.fileUrl} />
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export const checkSVG = (
	<svg
		fill='#1d9bf0'
		viewBox='0 0 24 24'
		aria-label='인증된 계정'
		role='img'
		className='r-1cvl2hr r-4qtqp9 r-yyyyoo r-1xvli5t r-9cviqr r-f9ja8p r-og9te1 r-bnwqim r-1plcrui r-lrvibr'
		data-testid='icon-verified'
	>
		<g>
			<path d='M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z'></path>
		</g>
	</svg>
);

export default Tweet;
