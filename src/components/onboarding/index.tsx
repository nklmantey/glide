import { onboardingList } from '@/constants'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useOnboardingStore } from '@/store'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui'

export function OnboardingFlow() {
	const navigate = useNavigate()
	const { setIsOnboardingCompleted } = useOnboardingStore()
	const [isExiting, setIsExiting] = useState(false)

	const fallDownVariants = {
		initial: { y: 0, opacity: 1 },
		exit: {
			y: 200,
			opacity: 0,
			transition: { duration: 1, ease: 'easeInOut' },
		},
		enter: { y: 0, opacity: 1, transition: { duration: 1, ease: 'easeInOut' } },
	}

	const containerVariants = {
		exit: {
			opacity: 0,
			scale: 0.95,
			transition: { duration: 0.5, ease: 'easeInOut' },
		},
	}

	function handleContinue() {
		setIsExiting(true)
		setTimeout(() => {
			setIsOnboardingCompleted(true)
			navigate('/auth/register')
		}, 600)
	}

	return (
		<motion.div className='flex flex-col gap-8' variants={containerVariants} animate={isExiting ? 'exit' : 'enter'}>
			<AnimatePresence mode='popLayout'>
				<motion.div
					key='welcome'
					variants={fallDownVariants}
					initial='initial'
					animate='enter'
					exit='exit'
					className='flex flex-col gap-6 max-w-2xl mx-auto'
				>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							duration: 1.5,
							ease: [0.22, 1, 0.36, 1],
						}}
						className='flex flex-col gap-2'
					>
						<p className='font-hbold text-xl'>{onboardingList[0].title}</p>
					</motion.div>

					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							duration: 2,
							ease: [0.22, 1, 0.36, 1],
							delay: 0.8,
						}}
						className='text-base text-zinc-500 leading-relaxed'
					>
						{onboardingList[0].description}
					</motion.p>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							duration: 1.2,
							delay: 2.5,
							ease: [0.22, 1, 0.36, 1],
						}}
						className='self-center mt-4'
					>
						<Button onClick={handleContinue}>hop in!</Button>
					</motion.div>
				</motion.div>
			</AnimatePresence>
		</motion.div>
	)
}
