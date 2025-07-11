import { BorderBeam, Button, OrbitingCircles, ProfileCard } from '@/components/ui'
import { motion } from 'motion/react'
import { SpinnerIcon } from '@phosphor-icons/react'
import { BoltSlashIcon, PlusCircleIcon } from '@heroicons/react/16/solid'
import { EmptyState } from '@/components/global'
import { useQuery } from '@tanstack/react-query'
import { getUserProfiles } from '@/api'
import { useProfileStore, useSessionStore } from '@/store'
import { CreateProfileDialog, DeleteProfileDialog } from '@/components/dialogs'
import { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { invoke } from '@tauri-apps/api/tauri'

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
	const { session } = useSessionStore()
	const { setProfiles } = useProfileStore()

	const {
		data: userProfilesFromDb,
		isPending: isFetchingUserProfilesFromDb,
		isRefetching,
		refetch: fetchUserProfilesFromDb,
	} = useQuery({
		queryKey: getUserProfiles.key,
		queryFn: () => getUserProfiles.fn({ id: session?.user.id! }),
	})

	useEffect(() => {
		if (userProfilesFromDb) setProfiles(userProfilesFromDb)
	}, [userProfilesFromDb])

	return (
		<div className='w-full h-full max-w-4xl flex items-start justify-center flex-col gap-2'>
			{isFetchingUserProfilesFromDb || isRefetching ? (
				<div className='bg-[darkgoldenrod]/10 w-fit rounded-md px-2 py-0.5 flex items-center gap-1'>
					<SpinnerIcon weight='bold' size={14} color='darkgoldenrod' className='animate-spin' />
					<p className='text-[darkgoldenrod] text-xs font-hbold'>sync in progress</p>
				</div>
			) : (
				<Button onClick={() => fetchUserProfilesFromDb()}>sync</Button>
			)}

			<div className='w-full h-full grid grid-cols-2 max-w-4xl gap-[2px]'>
				{/* ACTIVE PROFILE */}
				<div className='relative col-span-1 row-span-1 border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 rounded-xl overflow-hidden'>
					<CurrentProfile />
					<BorderBeam size={400} duration={15} delay={0} borderWidth={2.5} />
				</div>

				{/* PROFILES OVERVIEW */}
				<div className='relative col-span-1 row-span-1 border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 rounded-xl'>
					<YourProfiles />
					<BorderBeam size={400} duration={15} delay={4} borderWidth={2.5} />
				</div>
			</div>
		</div>
	)
}

function CurrentProfile() {
	const { activeProfile, setActiveProfile } = useProfileStore()

	const handleTurnOffProfile = async () => {
		if (activeProfile?.selected_apps) {
			try {
				setActiveProfile(null)

				await invoke('close_apps', {
					appNames: activeProfile.selected_apps.map((app: any) => app.name),
				})
			} catch (error) {
				console.error('Failed to close apps:', error)
			}
		}
	}

	return (
		<div className='flex flex-col items-center justify-start text-center space-y-6 relative w-full h-full'>
			{activeProfile ? (
				<div className='flex flex-col items-center justify-center w-full h-full gap-4'>
					{/* ORBITING CIRCLES ANIMATION */}
					<div className='relative flex h-full w-full flex-col items-center justify-center rounded-lg'>
						<span className='pointer-events-none whitespace-pre-wrap text-center text-8xl font-hbold text-zinc-500 dark:text-zinc-400 leading-none'>
							{activeProfile.profile_name}
						</span>

						<OrbitingCircles iconSize={40}>
							{activeProfile.selected_apps.map((app, index) => (
								<img key={index} width={40} height={40} src={app.icon} alt='app icon' />
							))}
						</OrbitingCircles>
						<OrbitingCircles iconSize={30} radius={100} reverse speed={2}>
							{activeProfile.selected_apps.map((app, index) => (
								<img key={index} width={40} height={40} src={app.icon} alt='app icon' />
							))}
						</OrbitingCircles>
					</div>

					<Button className='w-fit' onClick={handleTurnOffProfile}>
						<BoltSlashIcon className='size-4 text-zinc-400' />
						turn off active profile
					</Button>
				</div>
			) : (
				<div className='flex flex-col items-center justify-center space-y-2 w-full h-full'>
					<EmptyState message='no active profile at the moment' />
				</div>
			)}
		</div>
	)
}

function YourProfiles() {
	const { profiles, setActiveProfile, activeProfile } = useProfileStore()
	const [requesGetInstalledApplications, setRequesGetInstalledApplications] = useState(false)
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [profileToDelete, setProfileToDelete] = useState('')

	return (
		<div className='flex flex-col items-center justify-start text-center space-y-6 relative w-full h-full'>
			{/* SAVED PROFILES LIST */}
			{profiles.length > 0 ? (
				<div className='flex flex-col space-y-6 w-full'>
					<div className='flex items-center justify-start flex-1 space-x-2'>
						<h1 className='text-2xl font-medium'>saved profiles</h1>
						{profiles.length > 0 && (
							<TooltipProvider>
								<Tooltip delayDuration={300}>
									<TooltipTrigger asChild>
										<PlusCircleIcon
											onClick={() => {
												setRequesGetInstalledApplications(true)
												setIsCreateDialogOpen(true)
											}}
											// weight='duotone'
											// size={24}
											className='cursor-pointer text-zinc-400 size-4'
										/>
									</TooltipTrigger>
									<TooltipContent side='right'>
										<p>create new profile</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>
					<motion.div className='flex flex-wrap gap-2 w-full h-full' variants={containerVariants} initial='hidden' animate='show'>
						{profiles.map((profile) => (
							<motion.div key={profile.emoji} variants={itemVariants} className='w-full'>
								<ProfileCard
									profile={profile}
									isActive={activeProfile?.id === profile.id}
									onSetActive={setActiveProfile}
									onDelete={(id) => {
										setIsDeleteDialogOpen(true)
										setProfileToDelete(id)
									}}
								/>
							</motion.div>
						))}
					</motion.div>
				</div>
			) : (
				<div className='flex flex-col items-center justify-center space-y-4 w-full h-full'>
					<EmptyState message='no saved profiles' />
					<Button
						onClick={() => {
							setRequesGetInstalledApplications(true)
							setIsCreateDialogOpen(true)
						}}
					>
						create profile
					</Button>
				</div>
			)}

			<CreateProfileDialog
				isDialogOpen={isCreateDialogOpen}
				setIsDialogOpen={setIsCreateDialogOpen}
				requesGetInstalledApplications={requesGetInstalledApplications}
			/>

			<DeleteProfileDialog isDialogOpen={isDeleteDialogOpen} setIsDialogOpen={setIsDeleteDialogOpen} id={profileToDelete} />
		</div>
	)
}
