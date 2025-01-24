import { BorderBeam } from '../ui/border-beam'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import { ArrowsClockwise, Lightning, LightningSlash, PlusCircle, Trash } from '@phosphor-icons/react'
import EmptyState from '../global/empty-state'
import { useQuery } from '@tanstack/react-query'
import { getUserProfiles } from '@/api'
import { useProfileStore, useSessionStore } from '@/store'
import { CreateProfileDialog, DeleteProfileDialog } from '../dialogs'
import { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { invoke } from '@tauri-apps/api/tauri'
import { OrbitingCircles } from '../ui/orbiting-circles'
import Image from 'next/image'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

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
		isLoading: isFetchingUserProfilesFromDb,
		isPending,
	} = useQuery({
		queryKey: getUserProfiles.key,
		queryFn: () => getUserProfiles.fn({ id: session?.user.id! }),
		refetchInterval: 3600000, // 1 hour
	})

	useEffect(() => {
		if (userProfilesFromDb) setProfiles(userProfilesFromDb)
	}, [userProfilesFromDb])

	return (
		<div className='w-full h-full max-w-4xl flex items-start justify-center flex-col gap-2'>
			{(isFetchingUserProfilesFromDb || isPending) && (
				<div className='bg-[darkgoldenrod]/10 w-fit rounded-lg px-2 py-0.5 flex items-center gap-2'>
					<ArrowsClockwise weight='duotone' size={14} color='darkgoldenrod' className='animate-spin' />
					<p className='text-[darkgoldenrod] text-xs'>sync in progress</p>
				</div>
			)}
			<div className='w-full h-full grid grid-cols-2 max-w-4xl gap-[2px]'>
				{/* ACTIVE PROFILE */}
				<div className='relative col-span-1 row-span-1 border border-zinc-200 p-4 bg-white rounded-xl overflow-hidden'>
					<CurrentProfile />
					<BorderBeam size={400} duration={15} delay={0} borderWidth={2.5} />
				</div>

				{/* PROFILES OVERVIEW */}
				<div className='relative col-span-1 row-span-1 border border-zinc-200 p-4 bg-white rounded-xl'>
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
				await invoke('close_apps', {
					appPaths: activeProfile.selected_apps.map((app: any) => app.path),
				})
			} catch (error) {
				console.error('Failed to close apps:', error)
			}
		}
		setActiveProfile(null)
	}

	return (
		<div className='flex flex-col items-center justify-start  text-center space-y-6 relative w-full h-full'>
			{activeProfile ? (
				<div className='flex flex-col items-center justify-center w-full h-full gap-4'>
					<div className='relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg'>
						<span className='pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-black'>
							{activeProfile.profile_name}
						</span>

						<OrbitingCircles iconSize={40}>
							{activeProfile.selected_apps.map((app, index) => (
								<Image key={index} width={40} height={40} src={app.icon} alt='app icon' />
							))}
						</OrbitingCircles>
						<OrbitingCircles iconSize={30} radius={100} reverse speed={2}>
							{activeProfile.selected_apps.map((app, index) => (
								<Image key={index} width={40} height={40} src={app.icon} alt='app icon' />
							))}
						</OrbitingCircles>
					</div>
					<Button className='w-fit' onClick={handleTurnOffProfile}>
						<LightningSlash weight='duotone' size={16} />
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
	const { profiles, setActiveProfile } = useProfileStore()
	const [requesGetInstalledApplications, setRequesGetInstalledApplications] = useState(false)
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [profileToDelete, setProfileToDelete] = useState('')

	const handleSetActiveProfile = async (profile: any) => {
		setActiveProfile(profile)
		if (profile.selected_apps) {
			try {
				await invoke('open_apps', {
					appPaths: profile.selected_apps.map((app: any) => app.path),
				})
			} catch (error) {
				console.error('Failed to open apps:', error)
			}
		}
	}

	return (
		<div className='flex flex-col items-center justify-between p-8 max-w-md mx-auto text-center space-y-6'>
			{/* HEADER */}
			<div className='flex items-center gap-2'>
				<h1 className='text-2xl font-medium'>saved profiles</h1>
				{profiles.length > 0 && (
					<TooltipProvider>
						<Tooltip delayDuration={300}>
							<TooltipTrigger asChild>
								<PlusCircle
									onClick={() => {
										setRequesGetInstalledApplications(true)
										setIsCreateDialogOpen(true)
									}}
									weight='duotone'
									size={24}
									className='cursor-pointer text-zinc-400'
								/>
							</TooltipTrigger>
							<TooltipContent side='right'>
								<p>create new profile</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>

			{/* SAVED PROFILES LIST */}
			{profiles.length > 0 ? (
				<motion.div className='flex flex-wrap gap-2 w-full h-full' variants={containerVariants} initial='hidden' animate='show'>
					{profiles.map((profile) => (
						<motion.div key={profile.emoji} variants={itemVariants}>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button>
										<span className='text-xs'>{profile.emoji}</span>•<span className='text-xs'>{profile.profile_name}</span>•
										<div className='flex  flex-wrap items-center gap-2'>
											{profile.selected_apps?.map((app) => (
												<div key={app.name} className='bg-[goldenrod]/20 px-2 py-0.5 w-fit rounded-full'>
													<p className=' text-xs'>{app.name}</p>
												</div>
											))}
										</div>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent side='right'>
									<DropdownMenuItem className='flex items-center gap-1' onClick={() => handleSetActiveProfile(profile)}>
										<Lightning color='darkgoldenrod' weight='duotone' size={16} />
										set as active
									</DropdownMenuItem>
									<DropdownMenuItem
										className='flex items-center gap-1'
										onClick={() => {
											setIsDeleteDialogOpen(true)
											setProfileToDelete(profile.id)
										}}
									>
										<Trash color='crimson' weight='duotone' size={16} />
										delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</motion.div>
					))}
				</motion.div>
			) : (
				<div className='flex flex-col items-center justify-center space-y-4'>
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
