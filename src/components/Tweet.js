import React, { useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from 'fbase';
import { ref, deleteObject } from 'firebase/storage';

const Tweet = ({ tweetObj, isCreator }) => {
	const [isEditing, setIsEditing] = useState(false); // 편집
	const [newTweet, setNewTweet] = useState(tweetObj.text); // input

	const newTweetRef = doc(db, 'Tweets', tweetObj.id);

	const toggleEditing = () => setIsEditing((prev) => !prev);

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
				}
			} catch (err) {
				window.alert('트윗을 삭제하는 데 실패했습니다.');
			}
		}
	};

	return (
		<div key={tweetObj.id}>
			{isEditing ? (
				<>
					{isCreator && (
						<>
							<form onSubmit={onSubmit}>
								<input value={newTweet} onChange={onChange} type='text' placeholder='Edit your tweet' required />
								<input type='submit' value='update' />
							</form>
							<button onClick={toggleEditing}>cancel</button>
						</>
					)}
				</>
			) : (
				<>
					<h4>{tweetObj.text}</h4>
					{tweetObj.fileUrl && <img src={tweetObj.fileUrl} width='50px' />}
					{isCreator && (
						<>
							<button onClick={onDeleteClick}>Delete</button>
							<button onClick={toggleEditing}>Edit</button>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default Tweet;
