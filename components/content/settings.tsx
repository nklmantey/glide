import { logoutUser } from '@/api'
import { useActiveTabStore, useSessionStore } from '@/store'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button, Input } from '../ui'
import { DoorOpen, User, PaintBrush } from '@phosphor-icons/react/dist/ssr'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CircleWavyCheck } from '@phosphor-icons/react'

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
			icon: User,
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
		<div className='w-full h-full flex max-w-4xl'>
			{/* Settings Navigation */}
			<div className='flex flex-col pt-12 pb-1 justify-between'>
				<div className='flex flex-col gap-3'>
					{settingsLabels.map((i) => {
						const Icon = i.icon
						return (
							<button
								onClick={() => setActiveSection(i.label)}
								key={i.label}
								className={cn(
									'flex items-center gap-2 hover:cursor-pointer hover:bg-zinc-200 w-full px-2 py-0.5 transition-all duration-500',
									activeSection === i.label &&
										'hover:bg-[crimson]/10 hover:border-r-2 hover:border-r-[crimson] bg-[crimson]/10 border-r-2 border-r-[crimson] text-[crimson]'
								)}
							>
								<Icon weight='duotone' size={16} />
								<p>{i.label}</p>
							</button>
						)
					})}
				</div>

				<Button onClick={() => handleLogoutUser()} isLoading={isLoggingOutUser} destructive className='group w-fit self-end mr-4'>
					<DoorOpen className='text-[crimson]/50 group-hover:text-[crimson]' weight='duotone' size={16} />
				</Button>
			</div>

			{/* Settings Content */}
			<div className='flex-1 border border-zinc-200 rounded-xl p-12'>{settingsContent[activeSection as keyof typeof settingsContent]}</div>
		</div>
	)
}

function Profile() {
	const { session } = useSessionStore()

	const fields = [
		{
			label: 'name',
			value: session?.user?.user_metadata.name,
		},
		{
			label: 'email',
			value: session?.user?.user_metadata.email,
		},
	]

	const isUserEmailVerified = session?.user?.user_metadata.email_verified

	return (
		<div className='flex flex-col gap-8'>
			{fields.map((i) => (
				<div key={i.label} className='flex flex-col gap-[2px]'>
					<div key={i.label} className='flex flex-col gap-[2px]'>
						<p className='font-hbold'>{i.label}</p>
						<Input defaultValue={i.value} />
					</div>
					{i.label === 'email' && isUserEmailVerified && (
						<div className='bg-[green]/10 w-fit rounded-lg px-2 py-0.5 flex items-center gap-2'>
							<CircleWavyCheck weight='duotone' size={16} color='green' />
							<p className='text-[green]'>user email is verified</p>
						</div>
					)}
				</div>
			))}
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
