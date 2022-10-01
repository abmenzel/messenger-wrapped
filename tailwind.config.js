/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
		'./context/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			spacing: {
				'2xfull': '200%',
			},
			colors: {
				theme: {
					purple: '#4d2c56',
					'light-orange': '#e9ac8d',
					'dark-blue': '#3600e8',
					'almost-black': '#111',
					'light-pink': '#ffd4de',
					thistle: '#c9b0d4',
					lime: '#d2f66a',
					'midnight-blue': '#172172',
					hotpink: '#f76dc2',
				},
			},
			animation: {
				width: 'width 5s linear',
				scaleIn: 'scaleIn 0.5s ease-in-out forwards',
				scaleUp: 'scaleUp 0.5s ease-in-out forwards',
				bounceIn: 'bounceIn 0.2s ease-out forwards',
				moveUp: 'moveUp 5s ease-in-out forwards',
				moveAllRight: 'moveAllRight 3s ease-in-out forwards',
				grain: 'grain 8s steps(8) infinite',
			},
			keyframes: {
				grain: {
					'0%': { transform: 'translate(0, 0)' },
					'5%': { transform: 'translate(10%, -5%)' },
					'10%': { transform: 'translate(-5%, 10%)' },
					'15%': { transform: 'translate(-10%, -9%)' },
					'20%': { transform: 'translate(-2%, 5%)' },
					'25%': { transform: 'translate(-15%, -2%)' },
					'30%': { transform: 'translate(7%, 15%)' },
					'35%': { transform: 'translate(10%, -5%)' },
					'40%': { transform: 'translate(-5%, 9%)' },
					'45%': { transform: 'translate(3%, -15%)' },
					'50%': { transform: 'translate(-15%, 11%)' },
					'55%': { transform: 'translate(-5%, -9%)' },
					'60%': { transform: 'translate(10%, 5%)' },
					'65%': { transform: 'translate(7%, -6%)' },
					'70%': { transform: 'translate(-6%, 15%)' },
					'75%': { transform: 'translate(5%, 9%)' },
					'80%': { transform: 'translate(-3%, -15%)' },
					'85%': { transform: 'translate(7%, 6%)' },
					'90%': { transform: 'translate(-10%, -5%)' },
					'95%': { transform: 'translate(10%, 10%)' },
					'100%': { transform: 'translate(5%, -6%)' },
				},
				width: {
					'0%': {
						width: '0%',
					},
					'100%': {
						width: '100%',
					},
				},
				moveAllRight: {
					'0%': {
						transform: 'translateX(0)',
					},
					'100%': {
						transform: 'translateX(calc(-100% + 100vw))',
					},
				},
				moveUp: {
					'0%': {
						transform: 'translateY(0)',
					},
					'100%': {
						transform: 'translateY(-100vh)',
					},
				},
				scaleIn: {
					'0%': {
						transform: 'scale(1.1)',
						opacity: '0',
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1',
					},
				},
				bounceIn: {
					'0%': {
						transform: 'scale(1)',
					},
					'50%': {
						transform: 'scale(0.9)',
					},
					'100%': {
						transform: 'scale(1)',
					},
				},
				scaleUp: {
					'0%': {
						transform: 'scale(0.5)',
						opacity: '0',
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1',
					},
				},
			},
		},
	},
	plugins: [require('tailwindcss-animation-delay')],
}
