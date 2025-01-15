import { cn } from '@/lib/utils'
import { Spinner } from '@phosphor-icons/react/dist/ssr'
import { ReactNode, ButtonHTMLAttributes } from 'react'

type ButtonProps = {
	children: ReactNode
	isLoading?: boolean
	disabled?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ children, isLoading, disabled, ...props }: ButtonProps) {
	return (
		<button
			{...props}
			disabled={disabled || isLoading}
			className={cn(
				'bg-zinc-100 px-6 py-1 border-[1px] border-b-[4px] border-zinc-300 hover:bg-zinc-200 hover:border-b-[1px] hover:box-border hover:border-zinc-300 rounded-lg transition-all duration-300 text-zinc-400 text-sm hover:text-[#212427] tracking-tight flex items-center justify-center gap-2',
				(disabled || isLoading) && 'cursor-not-allowed hover:bg-zinc-100 bg-zinc-100 text-zinc-400 hover:text-zinc-400 border-none'
			)}
		>
			{isLoading ? <Spinner weight='duotone' size={20} className='animate-spin' /> : children}
		</button>
	)
}
