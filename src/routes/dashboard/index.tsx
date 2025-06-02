import { getUserProfiles, logoutUser, saveProfile } from '@/api'
import { Button } from '@/components/ui'
import { useActiveTabStore, useProfileStore, useSessionStore } from '@/store'
import { DoorOpenIcon } from '@phosphor-icons/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

export function DashboardPage() {
	const navigate = useNavigate()
	const { addProfile } = useProfileStore()
	const { session, setSession } = useSessionStore()
	const { setActiveTab } = useActiveTabStore()

	const { mutate: handleSaveProfile, isPending: isSavingProfile } = useMutation({
		mutationKey: saveProfile.key,
		mutationFn: saveProfile.fn,
		onSuccess: (data) => {
			toast.success('profile created!')

			// SAVE TO STORE
			addProfile(data)

			// CLEANUP
			// setIsDialogOpen(false)
			// setCurrentStep(1)
			// setFormState({ name: '', emoji: '', selectedApps: [] })
		},
		onError: (e) => {
			toast.error(e.message)
		},
	})

	const { mutate: handleLogoutUser, isPending: isLoggingOutUser } = useMutation({
		mutationKey: logoutUser.key,
		mutationFn: logoutUser.fn,
		onSuccess: () => {
			setSession(null)
			setActiveTab(0)
			toast('come back soon :)')
			navigate('/auth/login', { replace: true })
		},
		onError: (e) => {
			toast.error(e?.message?.toLowerCase())
		},
	})

	const {
		data: userProfilesFromDb,
		isPending: isFetchingUserProfilesFromDb,
		error,
		// isRefetching,
		// refetch: fetchUserProfilesFromDb,
	} = useQuery({
		queryKey: getUserProfiles.key,
		queryFn: () => getUserProfiles.fn({ id: session?.user.id! }),
	})

	return (
		<div className='p-20 flex flex-col gap-4'>
			{session && (
				<div>
					<p>{session?.user?.email}</p>
				</div>
			)}
			<Button
				isLoading={isSavingProfile}
				onClick={() =>
					handleSaveProfile({
						emoji: '👨‍💻',
						profile_name: 'John Doe',
						selected_apps: [{ name: 'Figma', path: '/figma' }],
					})
				}
				className='w-fit'
			>
				save profile
			</Button>

			<div>
				<Button destructive onClick={() => handleLogoutUser()} isLoading={isLoggingOutUser}>
					<DoorOpenIcon />
				</Button>
			</div>

			{isFetchingUserProfilesFromDb && <div>loading profiles....</div>}

			{userProfilesFromDb && userProfilesFromDb?.length > 0 && userProfilesFromDb?.map((p) => <div>{p.profile_name}</div>)}
			{userProfilesFromDb && userProfilesFromDb?.length === 0 && <div>none</div>}
			{error && <div>{error.message}</div>}
		</div>
	)
}
