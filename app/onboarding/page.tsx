'use client'

import { TextAnimate } from '@/components/animations'
import { AppContainer, Logo } from '@/components/global'
import { Button, Input } from '@/components/ui'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

export default function OnboardingPage() {
	return (
		<AppContainer>
			<div className='h-full w-full flex flex-col items-center justify-center gap-20'>
				<div className='flex flex-col gap-4 items-center'>
					<Logo />
					<TextAnimate animation='blurInUp' by='character'>
						effortless workflows, seamless productivity.
					</TextAnimate>
				</div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1, delay: 1.5, ease: 'easeInOut' }}
				>
					<Button>get started</Button>
				</motion.div>
			</div>
		</AppContainer>
	)
}
