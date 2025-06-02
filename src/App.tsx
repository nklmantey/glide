import { TextAnimate } from '@/components/animations'
import { AppContainer, Logo } from '@/components/global'
import { OnboardingFlow } from '@/components/onboarding'
import { Button } from '@/components/ui'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export default function OnboardingPage() {
	const navigate = useNavigate()
	const [isOnboardingStarted, setIsOnboardingStarted] = useState(false)
	const [isPageMounted, setIsPageMounted] = useState(false)

	function handleStartOnboarding() {
		setIsOnboardingStarted(true)
	}

	function handleLoginNavigate() {
		navigate('/auth/login')
	}

	const fallDownVariants = {
		initial: { y: 0, opacity: 1 },
		exit: {
			y: 200,
			opacity: 0,
			transition: { duration: 1, ease: 'easeInOut' },
		},
	}

	useEffect(() => {
		setIsPageMounted(true)
	}, [isPageMounted])

	return (
		<AppContainer>
			<AnimatePresence>
				{!isOnboardingStarted && (
					<motion.div
						className='h-full w-full flex flex-col items-center justify-center gap-8'
						variants={fallDownVariants}
						initial='initial'
						animate='initial'
						exit='exit'
						key='onboarding-container'
					>
						<div className='flex flex-col gap-4 items-center'>
							<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2.5, ease: 'easeInOut' }}>
								<Logo />
							</motion.div>
							{isPageMounted && (
								<TextAnimate key='text-animate' animation='blurInUp' by='character'>
									effortless workflows, seamless productivity.
								</TextAnimate>
							)}
						</div>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 1, delay: 1.5, ease: 'easeInOut' }}
							className='flex gap-1'
						>
							<Button onClick={handleLoginNavigate}>log in</Button>
							<Button onClick={handleStartOnboarding}>get started</Button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{isOnboardingStarted && (
				<div className='h-full w-full flex flex-col items-center justify-center'>
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: 'easeInOut' }}>
						<OnboardingFlow />
					</motion.div>
				</div>
			)}
		</AppContainer>
	)
}
