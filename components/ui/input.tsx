import { ReactNode, InputHTMLAttributes } from 'react'

type InputProps = {
	placeholder?: string
} & InputHTMLAttributes<HTMLInputElement>

export function Input({ placeholder, ...props }: InputProps) {
	return (
		<input
			{...props}
			className='bg-zinc-100 px-6 py-2 hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 rounded-full transition-all duration-300 text-sm tracking-tight min-w-[200px] text-[#212427] placeholder:text-zinc-400'
			placeholder={placeholder}
		/>
	)
}
