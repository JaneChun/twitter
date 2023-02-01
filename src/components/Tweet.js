import React from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from 'fbase';

const Tweet = ({ tweetObj, isCreator }) => {
	const onDeleteClick = async () => {
		const ok = window.confirm('이 트윗을 삭제하시겠습니까?');

		if (ok) {
			await deleteDoc(doc(db, 'Tweets', tweetObj.id));
		}
	};

	return (
		<div key={tweetObj.id}>
			<h4>{tweetObj.text}</h4>
			{isCreator && (
				<>
					<button onClick={onDeleteClick}>Delete</button>
					<button>Edit</button>
				</>
			)}
		</div>
	);
};

export default Tweet;
