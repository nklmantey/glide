import { BorderBeam } from '../ui/border-beam'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import { ArrowsClockwise, PlusCircle } from '@phosphor-icons/react'
import EmptyState from '../global/empty-state'
import { useQuery } from '@tanstack/react-query'
import { getUserProfiles } from '@/api'
import { useProfileStore, useSessionStore } from '@/store'
import { CreateProfileDialog, DeleteProfileDialog } from '../dialogs'
import { useEffect, useState } from 'react'

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

	const { data: userProfilesFromDb, isLoading: isFetchingUserProfilesFromDb } = useQuery({
		queryKey: getUserProfiles.key,
		queryFn: () => getUserProfiles.fn({ id: session?.user.id! }),
		refetchInterval: 3600000, // 1 hour
	})

	useEffect(() => {
		if (userProfilesFromDb) setProfiles(userProfilesFromDb)
	}, [userProfilesFromDb])

	return (
		<div className='w-full h-full max-w-4xl flex items-start justify-center flex-col gap-2'>
			{isFetchingUserProfilesFromDb && (
				<div className='bg-[darkgoldenrod]/10 w-fit rounded-lg px-2 py-0.5 flex items-center gap-2'>
					<ArrowsClockwise weight='duotone' size={14} color='darkgoldenrod' className='animate-spin' />
					<p className='text-[darkgoldenrod] text-xs'>sync in progress</p>
				</div>
			)}
			<div className='w-full h-full grid grid-cols-3 max-w-4xl gap-[2px]'>
				{/* ACTIVE PROFILE */}
				<div className='relative col-span-2 row-span-1 border border-zinc-200 p-4 bg-white rounded-xl'>
					<CurrentProfile />
					<BorderBeam colorFrom='white' colorTo='crimson' size={400} duration={15} delay={0} borderWidth={2.5} />
				</div>

				{/* B */}
				<div className='col-span-1 row-span-2 border border-zinc-200 p-4 bg-white rounded-xl'>to be decided</div>

				{/* PROFILES OVERVIEW */}
				<div className='relative col-span-2 row-span-1 border border-zinc-200 p-4 bg-white rounded-xl'>
					<YourProfiles />
					<BorderBeam colorFrom='white' colorTo='crimson' size={400} duration={15} delay={4} borderWidth={2.5} />
				</div>
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
	const { profiles } = useProfileStore()
	const [requesGetInstalledApplications, setRequesGetInstalledApplications] = useState(false)
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [activeProfile, setActiveProfile] = useState('')

	return (
		<div className='flex flex-col items-center justify-between p-8 max-w-md mx-auto text-center space-y-6'>
			<div className='flex items-center gap-2'>
				<h1 className='text-2xl font-medium'>saved profiles</h1>
				{profiles.length > 0 && (
					<PlusCircle
						onClick={() => {
							setRequesGetInstalledApplications(true)
							setIsCreateDialogOpen(true)
						}}
						weight='duotone'
						size={24}
						className='cursor-pointer text-zinc-400'
					/>
				)}
			</div>

			{profiles.length > 0 ? (
				<motion.div className='flex flex-wrap gap-2 w-full h-full' variants={containerVariants} initial='hidden' animate='show'>
					{profiles.map((profile) => (
						<motion.div
							key={profile.emoji}
							variants={itemVariants}
							onClick={() => {
								setIsDeleteDialogOpen(true)
								setActiveProfile(profile.id)
							}}
							className='flex items-center justify-center px-2 py-1 rounded gap-2 cursor-pointer bg-zinc-100 hover:bg-zinc-200'
						>
							<span className='text-xs'>{profile.emoji}</span>•<span className='text-xs'>{profile.profile_name}</span>•
							<div className='flex  flex-wrap items-center gap-2'>
								{profile.selected_apps?.map((app) => (
									<div key={app.name} className='bg-[goldenrod]/20 px-2 py-0.5 w-fit rounded-full'>
										<p className=' text-xs'>{app.name}</p>
									</div>
								))}
							</div>
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

			<DeleteProfileDialog isDialogOpen={isDeleteDialogOpen} setIsDialogOpen={setIsDeleteDialogOpen} id={activeProfile} />
		</div>
	)
}
