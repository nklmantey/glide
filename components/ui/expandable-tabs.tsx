'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface Tab {
	title: string
	icon: any
	type?: never
}

interface Separator {
	type: 'separator'
	title?: never
}

type TabItem = Tab | Separator

interface ExpandableTabsProps {
	tabs: TabItem[]
	className?: string
	activeColor?: string
	onChange?: (index: number | null) => void
}

const buttonVariants = {
	initial: {
		gap: 0,
		paddingLeft: '.5rem',
		paddingRight: '.5rem',
	},
	animate: (isSelected: boolean) => ({
		gap: isSelected ? '.5rem' : 0,
		paddingLeft: isSelected ? '1rem' : '.5rem',
		paddingRight: isSelected ? '1rem' : '.5rem',
	}),
}

const spanVariants = {
	initial: { width: 0, opacity: 0 },
	animate: { width: 'auto', opacity: 1 },
	exit: { width: 0, opacity: 0 },
}

const transition = { delay: 0.1, type: 'spring', bounce: 0, duration: 0.6 }

export function ExpandableTabs({ tabs, className, activeColor = 'text-primary', onChange }: ExpandableTabsProps) {
	const [selected, setSelected] = React.useState<number | null>(0)

	const handleSelect = (index: number) => {
		setSelected(index)
		onChange?.(index)
	}

	const Separator = () => <div className='mx-1 h-[24px] w-[1.2px] bg-zinc-300' aria-hidden='true' />

	return (
		<div className={cn('flex flex-wrap items-center gap-2 rounded-2xl border border-zinc-200 w-fit bg-zinc-50 p-1 shadow-sm', className)}>
			{tabs.map((tab, index) => {
				if (tab.type === 'separator') {
					return <Separator key={`separator-${index}`} />
				}

				const Icon = tab.icon
				return (
					<motion.button
						key={tab.title}
						variants={buttonVariants}
						initial={false}
						animate='animate'
						custom={selected === index}
						onClick={() => handleSelect(index)}
						transition={transition}
						className={cn(
							'relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300',
							selected === index ? cn('bg-[#e3e3e3]', activeColor) : 'text-muted-foreground hover:bg-muted hover:text-foreground'
						)}
					>
						<Icon
							size={20}
							weight={selected === index ? 'fill' : 'regular'}
							className={cn(selected === index ? 'text-[crimson]/80' : null)}
						/>
						<AnimatePresence initial={false}>
							{selected === index && (
								<motion.span
									variants={spanVariants}
									initial='initial'
									animate='animate'
									exit='exit'
									transition={transition}
									className={cn('overflow-hidden', selected === index ? 'text-[crimson]/80' : null)}
								>
									{tab.title}
								</motion.span>
							)}
						</AnimatePresence>
					</motion.button>
				)
			})}
		</div>
	)
}
