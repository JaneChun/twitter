/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		screens: {
			sm: '400px',
			md: '640px',
			lg: '1024px',
			xl: '1280px',
		},
	},
	plugins: [],
	variants: {
		extends: {
			display: ['group-hover'],
		},
	},
};
