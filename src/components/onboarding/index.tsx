import { onboardingList } from '@/constants'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useOnboardingStore } from '@/store'
import { useNavigate } from 'react-router'
import { TextAnimate } from '@/components/animations'
import { Button } from '@/components/ui'
import { ArrowLeftIcon } from '@phosphor-icons/react'

export function OnboardingFlow() {
	const navigate = useNavigate()
	const { setIsOnboardingCompleted } = useOnboardingStore()
	const [currentStep, setCurrentStep] = useState(0)

	// MOTION VARIANTS
	const fallDownVariants = {
		initial: { y: 0, opacity: 1 },
		exit: {
			y: 200,
			opacity: 0,
			transition: { duration: 1, ease: 'easeInOut' },
		},
		enter: { y: 0, opacity: 1, transition: { duration: 1, ease: 'easeInOut' } },
	}

	function handleOnboardingFlowForward() {
		if (currentStep === onboardingList.length - 1) {
			setIsOnboardingCompleted(true)
			navigate('/auth/register')
			return
		}

		setCurrentStep((prev) => prev + 1)
	}

	function handleOnboardingFlowBack() {
		if (currentStep === 0) return
		setCurrentStep((prev) => prev - 1)
	}

	return (
		<div className='flex flex-col gap-8'>
			<AnimatePresence mode='popLayout'>
				{onboardingList.map((item) =>
					item.id === currentStep ? (
						<motion.div
							key={item.id}
							variants={fallDownVariants}
							initial='initial'
							animate='enter'
							exit='exit'
							className='flex flex-col gap-4'
						>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 1, delay: 1.5, ease: 'easeInOut' }}
								className='flex flex-col gap-2'
							>
								<div className='w-8 h-8 flex items-center justify-center bg-[#212427] font-hbold text-zinc-200 rounded-full'>
									{item.id + 1}
								</div>
								<p className='font-hbold '>{item.title}</p>
							</motion.div>

							<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 3, delay: 2, ease: 'easeInOut' }}>
								<TextAnimate key={currentStep} className='max-w-2xl text-pretty text-zinc-500' animation='blurInUp' by='character'>
									{item.description}
								</TextAnimate>
							</motion.div>

							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 1, delay: 5.5, ease: 'easeInOut' }}
								className='self-center mt-4'
							>
								<div className='flex gap-1'>
									{currentStep !== 0 && (
										<Button onClick={handleOnboardingFlowBack}>
											<ArrowLeftIcon />
										</Button>
									)}
									<Button onClick={handleOnboardingFlowForward}>
										{currentStep === onboardingList.length - 1 ? 'hop in!' : 'continue'}
									</Button>
								</div>
							</motion.div>
						</motion.div>
					) : null
				)}
			</AnimatePresence>
		</div>
	)
}
