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
			},
		},
	},
	plugins: [],
} satisfies Config
