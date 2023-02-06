import React from 'react';

const ProfileNav = ({ selected, setSelected }) => {
	return (
		<nav className='flex text-sm text-gray-500 font-semibold justify-between border-b cursor-pointer'>
			<div className={selected === 0 ? 'p-1 border-b-4 border-gray-800 flex-1 text-center' : 'p-1 flex-1 text-center'} onClick={() => setSelected(0)}>
				트윗
			</div>
			<div className={selected === 1 ? 'p-1 border-b-4 border-gray-800 flex-1 text-center' : 'p-1 flex-1 text-center'} onClick={() => setSelected(1)}>
				미디어
			</div>
			<div className={selected === 2 ? 'p-1 border-b-4 border-gray-800 flex-1 text-center' : 'p-1 flex-1 text-center'} onClick={() => setSelected(2)}>
				마음에 들어요
			</div>
		</nav>
	);
};

export default ProfileNav;
