import { cn } from '@/lib/utils'
import { InputHTMLAttributes, useState } from 'react'
import { Eye, EyeClosed } from '@phosphor-icons/react'

type InputProps = {
	placeholder?: string
	isInvalid?: boolean
	error?: string
	isEditable?: boolean
	className?: string
	isPassword?: boolean
} & InputHTMLAttributes<HTMLInputElement>

export function Input({ placeholder, isInvalid, error, isEditable = true, className, isPassword, ...props }: InputProps) {
	const [showPassword, setShowPassword] = useState(false)

	return (
		<>
			<div className='relative'>
				<input
					{...props}
					type={isPassword ? (showPassword ? 'text' : 'password') : props.type}
					readOnly={!isEditable}
					className={cn(
						'bg-zinc-100 px-4 py-2 border-[1px] border-b-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 rounded-lg transition-all duration-300 tracking-tight min-w-[400px] text-[#212427] placeholder:text-zinc-400',
						isInvalid && 'border-2 border-[crimson] focus-visible:ring-0',
						!isEditable && 'cursor-not-allowed focus-visible:ring-transparent',
						isPassword && 'pr-12',
						className && className
					)}
					placeholder={placeholder}
				/>
				{isPassword && (
					<button
						type='button'
						onClick={() => setShowPassword(!showPassword)}
						className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 transition-colors'
					>
						{showPassword ? <EyeClosed weight='duotone' size={20} /> : <Eye weight='duotone' size={20} />}
					</button>
				)}
			</div>
			{error && <p className='text-[crimson] -mt-1 ml-2 tracking-tight max-w-sm'>{error}</p>}
		</>
	)
}
