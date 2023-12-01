import type { Config } from 'tailwindcss'

export default {
	content: ['./app/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#ece8de', // bg
				secondary: '#798777', // text
				tertiary: '#bdd2b6',
				cWhite: '#f9f7f7',
				tGreenP: '#3a4d39',
				tGreenS: '#739072',
				hover: '#596558',
			},
			backgroundImage: {
				login: "url('/assets/imgs/login.png')",
				register: "url('/assets/imgs/register.png')",
			},
		},
	},
	plugins: [],
} satisfies Config
