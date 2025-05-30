'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useActiveTabStore } from '@/store'

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
	const { activeTab, setActiveTab } = useActiveTabStore()

	const handleSelect = (index: number) => {
		setActiveTab(index)
		onChange?.(index)
	}

	const Separator = () => <div className='mx-1 h-[24px] w-[1.2px] bg-zinc-300 dark:bg-zinc-600' aria-hidden='true' />

	return (
		<div
			className={cn(
				'flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 w-fit bg-zinc-100 dark:bg-zinc-800/50 p-1 shadow-sm',
				className
			)}
		>
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
						custom={activeTab === index}
						onClick={() => handleSelect(index)}
						transition={transition}
						className={cn(
							'relative flex items-center rounded-md px-2 py-1 font-medium transition-colors duration-300',
							activeTab === index
								? cn('bg-zinc-200 dark:bg-zinc-700', activeColor)
								: 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 hover:text-zinc-700 dark:hover:text-zinc-300'
						)}
					>
						<Icon
							size={20}
							weight={activeTab === index ? 'fill' : 'regular'}
							className={cn(activeTab === index ? 'text-zinc-500 dark:text-zinc-300' : 'text-zinc-500 dark:text-zinc-400')}
						/>
						<AnimatePresence initial={false}>
							{activeTab === index && (
								<motion.span
									variants={spanVariants}
									initial='initial'
									animate='animate'
									exit='exit'
									transition={transition}
									className={cn('overflow-hidden', activeTab === index ? 'text-zinc-500 dark:text-zinc-300' : null)}
								>
									<p className='font-hbold text-lg'>{tab.title}</p>
								</motion.span>
							)}
						</AnimatePresence>
					</motion.button>
				)
			})}
		</div>
	)
}
