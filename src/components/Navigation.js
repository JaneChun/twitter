import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import emptyImg from '../images/empty-profile.jpeg';

const Navigation = ({ userObj }) => {
	return (
		<div>
			<ul className='absolute bottom-0 w-full p-5 flex justify-between bg-white'>
				<li className='text-3xl'>
					<Link to='/'>
						<Icon className='hover:scale-90 focus:scale-90' icon='bxs:home-circle' />
					</Link>
				</li>
				<li>
					<Link to='/profile'>
						<div className='w-7 h-7 rounded-full overflow-hidden bg-gray-200'>
							<img src={userObj.photoURL ? userObj.photoURL : emptyImg} />
						</div>
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default Navigation;
