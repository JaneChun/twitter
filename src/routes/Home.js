import React, { useState } from 'react';
import { db } from 'fbase';
import { collection, addDoc } from 'firebase/firestore';

const Home = () => {
	const [tweet, setTweet] = useState('');

	const onChange = (e) => {
		const {
			target: { value },
		} = e;
		setTweet(value); // = setTweet(e.target.value);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			const docRef = await addDoc(collection(db, 'Tweets'), {
				tweet,
				createdAt: Date.now(),
			});
			console.log('Document written with ID: ', docRef.id);
		} catch (error) {
			console.error('Error adding document: ', error);
		}

		setTweet('');
	};
	return (
		<>
			Home
			<form onSubmit={onSubmit}>
				<input value={tweet} onChange={onChange} type='text' placeholder="What's happening?" maxLength={120} />
				<input type='submit' value='Tweet' />
			</form>
		</>
	);
};

export default Home;
