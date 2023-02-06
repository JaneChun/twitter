import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

const Navigation = ({ profile }) => {
	return (
		<div>
			<ul className='border-t w-full px-5 py-4 flex justify-between bg-white'>
				<li className='text-3xl'>
					<Link to='/'>
						<Icon className='hover:scale-90 focus:scale-90' icon='bxs:home-circle' />
					</Link>
				</li>
				<li>
					<Link to='/profile'>
						<img className='w-7 h-7 object-cover rounded-full' src={profile?.photoURL} />
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default Navigation;
