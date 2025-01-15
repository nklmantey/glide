'use client'
import { cn } from '@/lib/utils'
import { LineVertical, Minus } from '@phosphor-icons/react'
import { OTPInput, SlotProps } from 'input-otp'

type OtpInputProps = {
	onComplete: (...args: any[]) => unknown
	autoFocus?: boolean
}

export default function OtpInput({ onComplete, autoFocus = true }: OtpInputProps) {
	return (
		<OTPInput
			maxLength={6}
			containerClassName='group flex items-center has-[:disabled]:opacity-30'
			render={({ slots }) => (
				<>
					<div className='flex'>
						{slots.slice(0, 3).map((slot, idx) => (
							<Slot key={idx} {...slot} />
						))}
					</div>

					<Minus size={20} className='text-zinc-400' />

					<div className='flex'>
						{slots.slice(3).map((slot, idx) => (
							<Slot key={idx} {...slot} />
						))}
					</div>
				</>
			)}
			onComplete={onComplete}
			autoFocus={autoFocus}
		/>
	)
}

// Feel free to copy. Uses @shadcn/ui tailwind colors.
function Slot(props: SlotProps) {
	return (
		<div
			className={cn(
				'relative font-berkeley w-10 h-14 text-[2rem]',
				'flex items-center justify-center',
				'transition-all duration-300',
				'border-border border-y border-r first:border-l first:rounded-l-md last:rounded-r-md',
				'group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20',
				'outline outline-0 outline-accent-foreground/20',
				{ 'outline-2 outline-zinc-400': props.isActive }
			)}
		>
			{props.char !== null && <div>{props.char}</div>}
			{props.hasFakeCaret && <LineVertical className='text-zinc-400 animate-caret-blink' size={20} />}
		</div>
	)
}
