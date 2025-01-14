import { ReactNode, ButtonHTMLAttributes } from 'react'

type ButtonProps = {
	children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ children, ...props }: ButtonProps) {
	return (
		<button
			{...props}
			className='bg-zinc-100 px-6 py-2 border-[1px] hover:bg-zinc-200 hover:box-border hover:border-zinc-300 rounded-full transition-all duration-300 text-zinc-400 text-sm hover:text-[#212427] tracking-tight'
		>
			{children}
		</button>
	)
}
