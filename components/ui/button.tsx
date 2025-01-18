import { cn } from '@/lib/utils'
import { Spinner } from '@phosphor-icons/react/dist/ssr'
import { ReactNode, ButtonHTMLAttributes } from 'react'

type ButtonProps = {
	children: ReactNode
	isLoading?: boolean
	disabled?: boolean
	destructive?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ children, isLoading, disabled, destructive, ...props }: ButtonProps) {
	return (
		<button
			{...props}
			disabled={disabled || isLoading}
			className={cn(
				'bg-zinc-100 px-6 py-1 border-[1px] border-b-4 border-zinc-300 hover:border-zinc-500 rounded-lg transition-all duration-500 text-zinc-500 hover:text-[#212427] tracking-tight flex items-center justify-center gap-2',
				destructive && 'border-[crimson]/50 text-[crimson]/50 border-b-4 rounded-lg hover:border-[crimson] hover:text-[crimson]',
				(disabled || isLoading) && 'cursor-not-allowed hover:bg-zinc-100 bg-zinc-100 text-zinc-400 hover:text-zinc-400 border-none',
				props.className && props.className
			)}
		>
			{isLoading ? <Spinner weight='duotone' size={16} className='animate-spin' /> : children}
		</button>
	)
}
