import type { Config } from 'tailwindcss'

export default {
	darkMode: ['class'],
	content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}', './node_modules/@ferrucc-io/emoji-picker/dist/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			keyframes: {
				'caret-blink': {
					'0%,70%,100%': {
						opacity: '1'
					},
					'20%,50%': {
						opacity: '0'
					}
				},
				'border-beam': {
					'100%': {
						'offset-distance': '100%'
					}
				},
				orbit: {
					'0%': {
						transform: 'rotate(calc(var(--angle) * 1deg)) translateY(calc(var(--radius) * 1px)) rotate(calc(var(--angle) * -1deg))'
					},
					'100%': {
						transform: 'rotate(calc(var(--angle) * 1deg + 360deg)) translateY(calc(var(--radius) * 1px)) rotate(calc((var(--angle) * -1deg) - 360deg))'
					}
				}
			},
			animation: {
				'caret-blink': 'caret-blink 1.2s ease-out infinite',
				'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
				orbit: 'orbit calc(var(--duration)*1s) linear infinite'
			},
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)'
			},
			fontFamily: {
				hbold: 'var(--font-haffer-bold)',
				regular: 'var(--font-haffer-regular)',
				semibold: 'var(--font-haffer-semibold)',
				berkeley: 'var(--font-berkeley)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require('tailwindcss-animate')],
} satisfies Config
