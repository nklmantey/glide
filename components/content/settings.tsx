import { logoutUser, updateUserInformation } from '@/api'
import { useActiveTabStore, useSessionStore } from '@/store'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button, Input } from '../ui'
import { DoorOpen, UserCircle, PaintBrush } from '@phosphor-icons/react/dist/ssr'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CircleWavyCheck } from '@phosphor-icons/react'

const Separator = () => <div className=' h-[1px] w-full bg-zinc-200' aria-hidden='true' />

export default function Settings() {
	const [activeSection, setActiveSection] = useState('profile')
	const { setSession } = useSessionStore()
	const { setActiveTab } = useActiveTabStore()
	const router = useRouter()

	const { mutate: handleLogoutUser, isPending: isLoggingOutUser } = useMutation({
		mutationKey: logoutUser.key,
		mutationFn: logoutUser.fn,
		onSuccess: () => {
			setSession(null)
			setActiveTab(0)
			toast('come back soon :)')
			router.replace('/auth/login')
		},
		onError: (e) => {
			toast.error(e?.message?.toLowerCase())
		},
	})

	const settingsLabels = [
		{
			icon: UserCircle,
			label: 'profile',
		},
		{
			label: 'appearance',
			icon: PaintBrush,
		},
	]

	const settingsContent = {
		profile: <Profile />,
		appearance: <Appearance />,
	}

	return (
		<div className='w-full h-full flex max-w-4xl bg-zinc-100 rounded-xl justify-between'>
			{/* Settings Navigation */}
			<div className='p-6 flex flex-col justify-between'>
				<div className='flex flex-col gap-3 w-48'>
					{settingsLabels.map((i) => {
						const Icon = i.icon
						return (
							<button
								onClick={() => setActiveSection(i.label)}
								key={i.label}
								className={cn(
									'relative flex items-center rounded-l-md px-3 py-1.5 font-medium transition-all duration-300 gap-2',
									activeSection === i.label && 'bg-white rounded-md shadow w-full'
								)}
							>
								<Icon
									size={20}
									weight={activeSection === i.label ? 'fill' : 'regular'}
									className={cn(activeSection === i.label ? 'text-zinc-500' : null)}
								/>
								<p className={cn(activeSection === i.label ? 'text-zinc-500' : null)}>{i.label}</p>
							</button>
						)
					})}
				</div>
				<Button onClick={() => handleLogoutUser()} isLoading={isLoggingOutUser} destructive className='group w-fit self-end mr-4'>
					<DoorOpen className='text-[crimson]/50 group-hover:text-[crimson]' weight='duotone' size={16} />
				</Button>
			</div>

			{/* Settings Content */}
			<div className='flex-1 border border-zinc-200 rounded-xl px-8 py-7 bg-white'>
				{settingsContent[activeSection as keyof typeof settingsContent]}
			</div>
		</div>
	)
}

function Profile() {
	const { session } = useSessionStore()
	const user = session?.user

	if (!user) return null

	const userMetadata = {
		name: user.user_metadata.name || 'Not set',
		email: user.user_metadata.email,
		avatar: user.user_metadata.avatar_url,
		isEmailVerified: user.user_metadata.email_verified,
		lastSignIn: user.last_sign_in_at
			? new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
			  })
			: 'Never',
	}

	const [canUpdateProfile, setCanUpdateProfile] = useState(false)
	const [updatedName, setUpdatedName] = useState(userMetadata.name)

	const { mutate: handleUpdateProfile, isPending: isUpdatingProfile } = useMutation({
		mutationKey: updateUserInformation.key,
		mutationFn: updateUserInformation.fn,
		onSuccess: () => {
			toast.success('profile updated successfully')
		},
	})

	return (
		<div className='flex flex-col gap-8 max-w-2xl'>
			{/* Profile Header */}
			<div className='flex items-start gap-6 bg-white p-6 rounded-xl border shadow-sm'>
				<div className='relative'>
					{userMetadata.avatar ? (
						<img
							src={userMetadata.avatar}
							alt={userMetadata.name}
							className='w-20 h-20 rounded-full object-cover border-4 border-zinc-100'
						/>
					) : (
						<div className='w-20 h-20 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center border-4 border-zinc-100'>
							<span className='text-2xl text-zinc-400 font-hbold'>{userMetadata.name.charAt(0).toUpperCase()}</span>
						</div>
					)}
					{userMetadata.isEmailVerified && (
						<div className='absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm'>
							<CircleWavyCheck weight='fill' size={20} className='text-green-500' />
						</div>
					)}
				</div>

				<div className='flex flex-col gap-1'>
					<h2 className='text-xl font-hbold text-zinc-800'>{userMetadata.name}</h2>
					<p className='text-sm text-zinc-500'>{userMetadata.email}</p>
					<div className='flex items-center gap-2 mt-2'>
						<div className='text-xs bg-zinc-100 px-2 py-1 rounded-md text-zinc-600'>Last active: {userMetadata.lastSignIn}</div>
						{userMetadata.isEmailVerified && (
							<div className='text-xs bg-green-50 text-green-600 px-2 py-1 rounded-md flex items-center gap-1.5'>
								<CircleWavyCheck weight='duotone' size={12} />
								Verified account
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Profile Fields */}
			<div className='space-y-6'>
				<div className='flex items-center justify-between border-b pb-4'>
					<h3 className='font-hbold text-zinc-800'>Profile Information</h3>
					{canUpdateProfile ? (
						<Button onClick={() => handleUpdateProfile({ name: updatedName })} isLoading={isUpdatingProfile}>
							save changes
						</Button>
					) : (
						<Button onClick={() => setCanUpdateProfile(true)}>update profile</Button>
					)}
				</div>
				<div className='grid gap-6'>
					<div className='flex items-center justify-between'>
						<label className='text-sm font-medium text-zinc-700'>Display Name</label>
						<Input
							defaultValue={userMetadata.name}
							isEditable={canUpdateProfile}
							disabled={!canUpdateProfile}
							onChange={(e) => setUpdatedName(e.target.value)}
							className='bg-white border-zinc-200'
							placeholder='Enter your display name'
						/>
					</div>
					<Separator />
					<div className='flex items-center justify-between'>
						<label className='text-sm text-zinc-700'>Email Address</label>
						<div className='relative flex flex-col gap-1'>
							<Input
								defaultValue={userMetadata.email}
								className='bg-white border-zinc-200'
								placeholder='Enter your email'
								isEditable={!userMetadata.isEmailVerified}
								disabled={userMetadata.isEmailVerified}
							/>
							{userMetadata.isEmailVerified && <p className='text-xs text-zinc-500'>Your email is verified and cannot be changed.</p>}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

function Appearance() {
	return (
		<div>
			{/* THEME SWITCHER */}
			theme switcher and transparent backgrounds coming soon, work in progress...
		</div>
	)
}
