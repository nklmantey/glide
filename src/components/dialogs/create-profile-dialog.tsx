import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button, Input } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useProfileStore } from '@/store'
import { AppInfo, FormState } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { toast } from 'sonner'
import { saveProfile } from '@/api'
import { ArrowLeftIcon, SpinnerIcon } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { EmojiPicker } from '@ferrucc-io/emoji-picker'

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

export function CreateProfileDialog({ requesGetInstalledApplications, isDialogOpen, setIsDialogOpen }: CreateProfileDialogProps) {
	const { addProfile } = useProfileStore()

	const [apps, setApps] = useState<AppInfo[] | null>(null)
	const [isLoadingInstalledApps, setIsLoadingInstalledApps] = useState(false)
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
			const installedApps = await invoke<AppInfo[]>('get_installed_apps')
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
		onError: (e) => {
			toast.error(e.message)
		},
	})

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className='sm:max-w-[525px]'>
				<DialogHeader>
					<DialogTitle className='text-zinc-800 dark:text-white'>
						{currentStep === 1 && 'choose a name for your profile'}
						{currentStep === 2 && 'choose an emoji'}
						{currentStep === 3 && 'add your apps'}
					</DialogTitle>
				</DialogHeader>

				{currentStep === 1 && (
					<div className='flex flex-col items-center justify-center mt-4 space-y-4 w-full'>
						<Input
							placeholder='profile name'
							value={formState.name}
							onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
							className='w-full'
						/>
						<Button onClick={handleNextStep} disabled={!formState.name}>
							next
						</Button>
					</div>
				)}

				{currentStep === 2 && (
					<div className='flex flex-col items-center justify-center mt-4 space-y-4'>
						<EmojiPicker
							className='w-full rounded-[8px] border-transparent'
							emojisPerRow={9}
							emojiSize={36}
							onEmojiSelect={(emoji) => {
								const emojiString = emoji.toString()
								if (emojiString !== formState.emoji) {
									setFormState((prev) => ({ ...prev, emoji: emojiString }))
								}
							}}
						>
							<EmojiPicker.Header>
								<EmojiPicker.Input
									placeholder='search for an emoji'
									className='h-[36px] bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 w-full rounded-[8px] text-[15px] focus:border-transparent focus:outline-none mb-1 dark:text-white dark:placeholder:text-zinc-500'
									hideIcon
								/>
							</EmojiPicker.Header>
							<EmojiPicker.Group>
								<EmojiPicker.List hideStickyHeader containerHeight={320} />
							</EmojiPicker.Group>
							<EmojiPicker.Preview>{({ previewedEmoji }) => <>{previewedEmoji && <EmojiPicker.Content />}</>}</EmojiPicker.Preview>
						</EmojiPicker>
						<div className='flex gap-1 justify-center'>
							<Button onClick={handlePrevStep}>
								<ArrowLeftIcon />
							</Button>
							<Button onClick={handleNextStep} disabled={!formState.emoji}>
								next
							</Button>
						</div>
					</div>
				)}

				{currentStep === 3 && isLoadingInstalledApps && <SpinnerIcon color='crimson' weight='duotone' className='animate-spin' size={16} />}
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
											? 'bg-[green]/10 dark:bg-[green]/15 ring-1 ring-[green]/50 dark:ring-[green]/30'
											: 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'
									)}
								>
									{app.icon ? (
										<img src={app.icon} alt={`${app.name} icon`} className='w-4 h-4' />
									) : (
										<div className='w-4 h-4 bg-zinc-200 dark:bg-zinc-600 rounded' />
									)}
									<span className='text-sm text-zinc-700 dark:text-zinc-300'>{app.name}</span>
								</motion.div>
							))}
						</motion.div>
						<div className='flex gap-1 justify-center'>
							<Button onClick={handlePrevStep}>
								<ArrowLeftIcon />
							</Button>
							<Button
								onClick={() => {
									handleSaveProfile({
										profile_name: formState.name,
										emoji: formState.emoji,
										selected_apps: formState.selectedApps,
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
