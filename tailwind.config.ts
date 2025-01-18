import type { Config } from 'tailwindcss'

export default {
	darkMode: ['class'],
	content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			keyframes: {
				'caret-blink': {
					'0%,70%,100%': {
						opacity: '1',
					},
					'20%,50%': {
						opacity: '0',
					},
				},
				'border-beam': {
					'100%': {
						'offset-distance': '100%',
					},
				},
			},
			animation: {
				'caret-blink': 'caret-blink 1.2s ease-out infinite',
				'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
			},
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
			},
			fontFamily: {
				studio: 'var(--font-studio)',
				berkeley: 'var(--font-berkeley)',
				geist: 'var(--font-geist)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
} satisfies Config
