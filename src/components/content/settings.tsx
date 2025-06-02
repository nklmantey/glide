import { logoutUser, updateUserInformation } from '@/api'
import { useActiveTabStore, useSessionStore } from '@/store'
import { useThemeStore } from '@/store'
import type { Theme } from '@/store/useTheme'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button, Input } from '@/components/ui'
import { DoorOpenIcon, UserCircleIcon, PaintBrushIcon, SunIcon, MoonIcon, CircleWavyCheckIcon } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { useNavigate } from 'react-router'

const Separator = () => <div className='h-[1px] w-full bg-zinc-200 dark:bg-zinc-700' aria-hidden='true' />

export default function Settings() {
	const navigate = useNavigate()
	const [activeSection, setActiveSection] = useState('profile')
	const { setSession } = useSessionStore()
	const { setActiveTab } = useActiveTabStore()

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

	const settingsLabels = [
		{
			icon: UserCircleIcon,
			label: 'profile',
		},
		{
			label: 'appearance',
			icon: PaintBrushIcon,
		},
	]

	const settingsContent = {
		profile: <Profile />,
		appearance: <Appearance />,
	}

	return (
		<div className='w-full h-full flex max-w-4xl bg-zinc-100 dark:bg-zinc-900 rounded-xl justify-between'>
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
									activeSection === i.label
										? 'bg-white dark:bg-zinc-800 rounded-md shadow w-full'
										: 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
								)}
							>
								<Icon
									size={20}
									weight={activeSection === i.label ? 'fill' : 'regular'}
									className={cn(activeSection === i.label ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-600 dark:text-zinc-400')}
								/>
								<p className={cn(activeSection === i.label ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-600 dark:text-zinc-400')}>
									{i.label}
								</p>
							</button>
						)
					})}
				</div>
				<Button onClick={() => handleLogoutUser()} isLoading={isLoggingOutUser} destructive className='group w-fit self-end mr-4'>
					<DoorOpenIcon className='text-[crimson]/50 group-hover:text-[crimson]' weight='duotone' size={16} />
				</Button>
			</div>

			{/* Settings Content */}
			<div className='flex-1 border border-zinc-200 dark:border-zinc-700 rounded-xl px-8 py-7 bg-white dark:bg-zinc-800'>
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
			<div className='flex items-start gap-6 bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm'>
				<div className='relative'>
					{userMetadata.avatar ? (
						<img
							src={userMetadata.avatar}
							alt={userMetadata.name}
							className='w-20 h-20 rounded-full object-cover border-4 border-zinc-100 dark:border-zinc-700'
						/>
					) : (
						<div className='w-20 h-20 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center border-4 border-zinc-100 dark:border-zinc-700'>
							<span className='text-2xl text-zinc-400 dark:text-zinc-500 font-hbold'>{userMetadata.name.charAt(0).toUpperCase()}</span>
						</div>
					)}
					{userMetadata.isEmailVerified && (
						<div className='absolute bottom-0 right-0 bg-white dark:bg-zinc-800 rounded-full p-1 shadow-sm'>
							<CircleWavyCheckIcon weight='fill' size={20} className='text-green-500' />
						</div>
					)}
				</div>

				<div className='flex flex-col gap-1'>
					<h2 className='text-xl font-hbold text-zinc-800 dark:text-white'>{userMetadata.name}</h2>
					<p className='text-sm text-zinc-500 dark:text-zinc-400'>{userMetadata.email}</p>
					<div className='flex items-center gap-2 mt-2'>
						<div className='text-xs bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-300'>
							Last active: {userMetadata.lastSignIn}
						</div>
						{userMetadata.isEmailVerified && (
							<div className='text-xs bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 px-2 py-1 rounded-md flex items-center gap-1.5'>
								<CircleWavyCheckIcon weight='duotone' size={12} />
								Verified account
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Profile Fields */}
			<div className='space-y-6'>
				<div className='flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 pb-4'>
					<h3 className='font-hbold text-zinc-800 dark:text-white'>Profile Information</h3>
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
						<label className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>Display Name</label>
						<Input
							defaultValue={userMetadata.name}
							isEditable={canUpdateProfile}
							disabled={!canUpdateProfile}
							onChange={(e) => setUpdatedName(e.target.value)}
							className='bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
							placeholder='Enter your display name'
						/>
					</div>
					<Separator />
					<div className='flex items-center justify-between'>
						<label className='text-sm text-zinc-700 dark:text-zinc-300'>Email Address</label>
						<div className='relative flex flex-col gap-1'>
							<Input
								defaultValue={userMetadata.email}
								className='bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
								placeholder='Enter your email'
								isEditable={!userMetadata.isEmailVerified}
								disabled={userMetadata.isEmailVerified}
							/>
							{userMetadata.isEmailVerified && (
								<p className='text-xs text-zinc-500 dark:text-zinc-400'>Your email is verified and cannot be changed.</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

function Appearance() {
	const { theme, setTheme } = useThemeStore()
	const { setTheme: setNextTheme } = useTheme()

	console.log('theme from store', theme)

	useEffect(() => {
		setNextTheme(theme)
	}, [])

	const themeOptions = [
		{
			value: 'light',
			label: 'light',
			icon: SunIcon,
			description: 'for bright environments',
			color: 'text-yellow-500',
		},
		{
			value: 'dark',
			label: 'dark',
			icon: MoonIcon,
			description: 'for low-light environments',
			color: 'text-blue-700',
		},
	] as const

	const handleThemeChange = (newTheme: Theme) => {
		setTheme(newTheme)
		setNextTheme(newTheme)
	}

	return (
		<div className='flex flex-col gap-8 max-w-2xl'>
			<div className='flex flex-col gap-6'>
				<div className='flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 pb-4'>
					<h3 className='font-hbold text-zinc-800 dark:text-white'>appearance</h3>
					<p className='text-sm text-zinc-500 dark:text-zinc-400'>customize how glide looks on your device</p>
				</div>

				<div className='grid gap-4'>
					{themeOptions.map((option) => {
						const Icon = option.icon
						return (
							<button
								key={option.value}
								onClick={() => handleThemeChange(option.value)}
								className={cn(
									'flex items-center gap-4 p-4 rounded-lg border transition-all duration-200',
									theme === option.value
										? 'bg-zinc-200 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600'
										: 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
								)}
							>
								<div
									className={cn('p-2 rounded-md', theme === option.value ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800')}
								>
									<Icon size={20} weight='duotone' className={theme === option.value ? option.color : 'text-zinc-700 dark:text-zinc-400'} />
								</div>
								<div className='flex flex-col items-start gap-1'>
									<span className='font-hbold text-zinc-800 dark:text-white'>{option.label}</span>
									<span
										className={cn(
											'text-sm',
											theme === option.value ? 'text-zinc-800 dark:text-zinc-200' : 'text-zinc-400 dark:text-zinc-500'
										)}
									>
										{option.description}
									</span>
								</div>
							</button>
						)
					})}
				</div>
			</div>
		</div>
	)
}
