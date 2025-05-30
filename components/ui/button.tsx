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
				'bg-zinc-100 dark:bg-zinc-800 px-6 py-1 border-[1px] border-b-4 border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-500 rounded-lg transition-all duration-500 text-zinc-500 dark:text-zinc-400 hover:text-[#212427] dark:hover:text-white tracking-tight flex items-center justify-center gap-2',
				destructive &&
					'border-[crimson]/50 text-[crimson]/50 border-b-4 rounded-lg hover:border-[crimson] hover:text-[crimson] dark:border-[crimson]/30 dark:text-[crimson]/30 dark:hover:border-[crimson] dark:hover:text-[crimson]',
				(disabled || isLoading) &&
					'cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 hover:text-zinc-400 dark:hover:text-zinc-600 border-none',
				props.className && props.className
			)}
		>
			{isLoading ? <Spinner weight='duotone' size={16} className='animate-spin' /> : children}
		</button>
	)
}
