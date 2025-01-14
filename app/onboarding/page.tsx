'use client'

import { TextAnimate } from '@/components/animations'
import { AppContainer, Logo } from '@/components/global'
import { OnboardingFlow } from '@/components/onboarding'
import { Button } from '@/components/ui'
import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'

export default function OnboardingPage() {
	const [isOnboardingStarted, setIsOnboardingStarted] = useState(false)

	function handleStartOnboarding() {
		setIsOnboardingStarted(true)
	}

	// Exit animation variants
	const fallDownVariants = {
		initial: { y: 0, opacity: 1 },
		exit: {
			y: 200,
			opacity: 0,
			transition: { duration: 1, ease: 'easeInOut' },
		},
	}

	return (
		<AppContainer>
			<AnimatePresence>
				{!isOnboardingStarted && (
					<motion.div
						className='h-full w-full flex flex-col items-center justify-center gap-20'
						variants={fallDownVariants}
						initial='initial'
						animate='initial'
						exit='exit'
					>
						<div className='flex flex-col gap-4 items-center'>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 2.5, ease: 'easeInOut' }}
							>
								<Logo />
							</motion.div>
							<TextAnimate animation='blurInUp' by='character'>
								effortless workflows, seamless productivity.
							</TextAnimate>
						</div>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 1, delay: 1.5, ease: 'easeInOut' }}
						>
							<Button onClick={handleStartOnboarding}>get started</Button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{isOnboardingStarted && (
				<div className='h-full w-full flex flex-col items-center justify-center'>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 1, ease: 'easeInOut' }}
					>
						<OnboardingFlow />
					</motion.div>
				</div>
			)}
		</AppContainer>
	)
}
