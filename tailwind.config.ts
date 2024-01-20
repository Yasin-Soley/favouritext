import type { Config } from 'tailwindcss'

export default {
	content: ['./app/**/*.{js,jsx,ts,tsx}'],
	theme: {
		borderRadius: {
			none: '0',
			sm: '5px',
			full: '100%',
		},
		extend: {
			colors: {
				primary: '#ece8de', // bg
				secondary: '#798777', // text
				tertiary: '#bdd2b6',
				cWhite: '#f9f7f7',
				tGreenP: '#3a4d39',
				tGreenS: '#739072',
				green_dark: '#596558',
				green_light: '#E1EADE',
				main: '#D9D9D9',
			},
			backgroundImage: {
				login: "url('/assets/imgs/login.png')",
				register: "url('/assets/imgs/register.png')",
				footer: "url('/assets/imgs/footer.png')",
				landingMain: "url('/assets/imgs/main.png')",
				landingPoem: "url('/assets/imgs/1.png')",
				landingDictionary: "url('/assets/imgs/2.png')",
			},
		},
	},
	plugins: [],
} satisfies Config
