import { cn } from '@/lib/utils'
import { ReactNode, InputHTMLAttributes } from 'react'

type InputProps = {
	placeholder?: string
	isInvalid?: boolean
	error?: string
	isEditable?: boolean
} & InputHTMLAttributes<HTMLInputElement>

export function Input({ placeholder, isInvalid, error, isEditable = true, ...props }: InputProps) {
	return (
		<>
			<input
				{...props}
				readOnly={!isEditable}
				className={cn(
					'bg-zinc-100 px-4 py-2 border-[1px] border-b-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 rounded-lg transition-all duration-300 tracking-tight min-w-[400px] text-[#212427] placeholder:text-zinc-400',
					isInvalid && 'border-2 border-[crimson] focus-visible:ring-0',
					!isEditable && 'cursor-not-allowed focus-visible:ring-transparent'
				)}
				placeholder={placeholder}
			/>
			{error && <p className='text-[crimson] -mt-1 ml-2 tracking-tight max-w-sm'>{error}</p>}
		</>
	)
}
