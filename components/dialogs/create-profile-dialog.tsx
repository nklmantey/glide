import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { cn } from '@/lib/utils'
import { useProfileStore, useSessionStore } from '@/store'
import { AppInfo, FormState } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { tauri } from '@tauri-apps/api'
import { toast } from 'sonner'
import { saveProfile } from '@/api'
import { Button } from '../ui'
import { ArrowLeft } from '@phosphor-icons/react'
import { motion } from 'motion/react'

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

type CreateProfileDialogProps = {
	requesGetInstalledApplications: boolean
	isDialogOpen: boolean
	setIsDialogOpen: (isDialogOpen: boolean) => void
}

export default function CreateProfileDialog({ requesGetInstalledApplications, isDialogOpen, setIsDialogOpen }: CreateProfileDialogProps) {
	const { addProfile } = useProfileStore()
	const { session } = useSessionStore()

	const [apps, setApps] = useState<AppInfo[] | null>(null)
	const [__, setIsLoadingInstalledApps] = useState(false)
	const [_, setGetInstalledAppsError] = useState('')
	const [currentStep, setCurrentStep] = useState(1)
	const [formState, setFormState] = useState<FormState>({
		name: '',
		emoji: '',
		selectedApps: [],
	})

	const handleAppToggle = (app: AppInfo) => {
		setFormState({
			...formState,
			selectedApps: formState.selectedApps.some((selectedApp) => selectedApp.path === app.path)
				? formState.selectedApps.filter((selectedApp) => selectedApp.path !== app.path)
				: [...formState.selectedApps, app],
		})
	}

	const handleNextStep = () => setCurrentStep((prev) => prev + 1)
	const handlePrevStep = () => setCurrentStep((prev) => prev - 1)

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

	const { mutate: handleSaveProfile, isPending: isSavingProfile } = useMutation({
		mutationKey: saveProfile.key,
		mutationFn: saveProfile.fn,
		onSuccess: (data) => {
			toast.success('profile created!')

			// SAVE TO STORE
			addProfile(data)

			// CLEANUP
			setIsDialogOpen(false)
			setCurrentStep(1)
			setFormState({ name: '', emoji: '', selectedApps: [] })
		},
	})

	return (
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
									onClick={() => handleAppToggle(app)}
									className={cn(
										'flex items-center px-2 py-1 rounded gap-2 cursor-pointer',
										formState.selectedApps.some((selectedApp) => selectedApp.path === app.path)
											? 'bg-[green]/10 ring-1 ring-[green]'
											: 'bg-zinc-100 hover:bg-zinc-200'
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
							<Button
								onClick={() => {
									handleSaveProfile({
										profile_name: formState.name,
										emoji: formState.emoji,
										selected_apps: formState.selectedApps,
										user_id: session?.user.id!,
									})
								}}
								isLoading={isSavingProfile}
								disabled={formState.selectedApps.length === 0}
							>
								save profile
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
