import Image from 'next/image'
import { BorderBeam } from '../ui/border-beam'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { tauri } from '@tauri-apps/api'
import { motion } from 'motion/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { cn } from '@/lib/utils'
import { ArrowLeft } from '@phosphor-icons/react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import EmptyState from '../global/empty-state'

interface AppInfo {
	name: string
	path: string
	bundle_id?: string
	icon?: any
}

interface FormState {
	name: string
	emoji: string
	selectedApps: string[]
}

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
}

const itemVariants = {
	hidden: {
		opacity: 0,
		y: 20,
	},
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.4,
			ease: 'easeOut',
		},
	},
}

export default function Dashboard() {
	return (
		<div className='w-full h-full grid grid-cols-3 max-w-4xl gap-[2px]'>
			{/* ACTIVE PROFILE */}
			<div className='relative col-span-2 row-span-1 border border-zinc-200 p-4 bg-white rounded-xl'>
				<CurrentProfile />
				<BorderBeam colorFrom='white' colorTo='crimson' size={400} duration={15} delay={0} borderWidth={2.5} />
			</div>

			{/* B */}
			<div className='col-span-1 row-span-2 border border-zinc-200 p-4 bg-white rounded-xl'>B</div>

			{/* PROFILES OVERVIEW */}
			<div className='relative col-span-2 row-span-1 border border-zinc-200 p-4 bg-white rounded-xl'>
				<YourProfiles />
				<BorderBeam colorFrom='white' colorTo='crimson' size={400} duration={15} delay={4} borderWidth={2.5} />
			</div>
		</div>
	)
}

function CurrentProfile() {
	return (
		<div className='flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center space-y-6'>
			<h1 className='text-2xl font-medium'>current active profile</h1>

			<div className='flex flex-col items-center justify-center space-y-2'>
				<EmptyState message='no active profile at the moment' />
			</div>
		</div>
	)
}

function YourProfiles() {
	const [isLoadingInstalledApps, setIsLoadingInstalledApps] = useState(false)
	const [_, setGetInstalledAppsError] = useState('')
	const [requesGetInstalledApplications, setRequesGetInstalledApplications] = useState(false)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [currentStep, setCurrentStep] = useState(1)
	const [formState, setFormState] = useState<FormState>({
		name: '',
		emoji: '',
		selectedApps: [],
	})

	const [apps, setApps] = useState<AppInfo[] | null>(null)

	async function loadApps() {
		try {
			setIsLoadingInstalledApps(true)
			const installedApps = await tauri.invoke<AppInfo[]>('get_installed_apps')
			setApps(installedApps)
		} catch (err) {
			setGetInstalledAppsError(err instanceof Error ? err.message : 'Failed to load apps')
		} finally {
			setIsLoadingInstalledApps(false)
		}
	}

	useEffect(() => {
		if (requesGetInstalledApplications) loadApps()
	}, [requesGetInstalledApplications])

	const handleNextStep = () => setCurrentStep((prev) => prev + 1)
	const handlePrevStep = () => setCurrentStep((prev) => prev - 1)

	const handleAppToggle = (appPath: string) => {
		setFormState((prev) => ({
			...prev,
			selectedApps: prev.selectedApps.includes(appPath)
				? prev.selectedApps.filter((path) => path !== appPath)
				: [...prev.selectedApps, appPath],
		}))
	}

	const handleSubmit = () => {
		console.log('FINAL VALUES:', formState)
		setIsDialogOpen(false)
		setCurrentStep(1)
		setFormState({ name: '', emoji: '', selectedApps: [] })
	}

	return (
		<div className='flex flex-col items-center justify-between p-8 max-w-md mx-auto text-center space-y-6'>
			<h1 className='text-2xl font-medium'>saved profiles</h1>

			<div className='flex flex-col items-center justify-center space-y-4'>
				<EmptyState message='no saved profiles' />
				<Button
					onClick={() => {
						setIsDialogOpen(true)
						setRequesGetInstalledApplications(true)
					}}
					isLoading={isLoadingInstalledApps}
				>
					create profile
				</Button>
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>
							{currentStep === 1 && 'choose a name for your profile'}
							{currentStep === 2 && 'choose an emoji'}
							{currentStep === 3 && 'add your apps'}
						</DialogTitle>
					</DialogHeader>

					{currentStep === 1 && (
						<div className='flex flex-col items-center justify-center mt-4 space-y-4'>
							<Input
								placeholder='profile name'
								value={formState.name}
								onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
								className='min-w-full'
							/>
							<Button onClick={handleNextStep} disabled={!formState.name}>
								next
							</Button>
						</div>
					)}

					{currentStep === 2 && (
						<div className='flex flex-col items-center justify-center mt-4 space-y-4'>
							<div className='grid grid-cols-4 gap-2'>
								{['🚀', '🎨', '🎵', '🖌️', '💻', '🎧', '📑', '🎮'].map((emoji) => (
									<button
										key={emoji}
										onClick={() => setFormState((prev) => ({ ...prev, emoji }))}
										className={cn(
											'saturate-200 grayscale p-2 rounded hover:bg-zinc-100',
											formState.emoji === emoji && 'saturate-100 grayscale-0 bg-zinc-200'
										)}
									>
										{emoji}
									</button>
								))}
							</div>
							<div className='flex gap-1 justify-center'>
								<Button onClick={handlePrevStep}>
									<ArrowLeft />
								</Button>
								<Button onClick={handleNextStep} disabled={!formState.emoji}>
									next
								</Button>
							</div>
						</div>
					)}

					{currentStep === 3 && apps && (
						<div className='flex flex-col items-center justify-center mt-4 space-y-4'>
							<motion.div className='flex flex-wrap gap-2' variants={containerVariants} initial='hidden' animate='show'>
								{apps.map((app) => (
									<motion.div
										key={app.path}
										variants={itemVariants}
										onClick={() => handleAppToggle(app.path)}
										className={cn(
											'flex items-center px-2 py-1 rounded gap-2 cursor-pointer',
											formState.selectedApps.includes(app.path) ? 'bg-[green]/10 ring-1 ring-[green]' : 'bg-zinc-100 hover:bg-zinc-200'
										)}
									>
										{app.icon ? (
											<img src={app.icon} alt={`${app.name} icon`} className='w-4 h-4' />
										) : (
											<div className='w-4 h-4 bg-zinc-200 rounded' />
										)}
										<span className='text-sm text-zinc-700'>{app.name}</span>
									</motion.div>
								))}
							</motion.div>
							<div className='flex gap-1 justify-center'>
								<Button onClick={handlePrevStep}>
									<ArrowLeft />
								</Button>
								<Button onClick={handleSubmit} disabled={formState.selectedApps.length === 0}>
									save profile
								</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}
