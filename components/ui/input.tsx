import { cn } from '@/lib/utils'
import { ReactNode, InputHTMLAttributes } from 'react'

type InputProps = {
	placeholder?: string
	isInvalid?: boolean
	error?: string
} & InputHTMLAttributes<HTMLInputElement>

export function Input({ placeholder, isInvalid, error, ...props }: InputProps) {
	return (
		<>
			<input
				{...props}
				className={cn(
					'bg-zinc-100 px-6 py-2 hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 rounded-full transition-all duration-300 text-sm tracking-tight min-w-[400px] text-[#212427] placeholder:text-zinc-400',
					isInvalid && 'border-2 border-[crimson] focus-visible:ring-0'
				)}
				placeholder={placeholder}
			/>
			{error && (
				<p className='text-[crimson] -mt-1 ml-2 tracking-tight text-sm max-w-sm'>
					{error}
				</p>
			)}
		</>
	)
}
