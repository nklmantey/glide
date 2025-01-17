import { logoutUser } from '@/api'
import { useActiveTabStore, useSessionStore } from '@/store'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '../ui'
import { DoorOpen, User, Bell, Shield, Gear, PaintBrush } from '@phosphor-icons/react/dist/ssr'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function Settings() {
	const [activeSection, setActiveSection] = useState('profile')
	const { session, setSession } = useSessionStore()
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
			label: 'notifications',
			icon: Bell,
		},
		{
			label: 'privacy & security',
			icon: Shield,
		},
		{
			label: 'appearance',
			icon: PaintBrush,
		},
	]

	return (
		<div className='w-full h-full flex max-w-4xl'>
			{/* Settings Navigation */}
			<div className='flex flex-col pt-12 pb-1 justify-between'>
				<div className='flex flex-col gap-3 pr-4'>
					{settingsLabels.map((i) => {
						const Icon = i.icon
						return (
							<button
								onClick={() => setActiveSection(i.label)}
								key={i.label}
								className={cn(
									'flex items-center gap-2 hover:cursor-pointer hover:bg-zinc-200 w-full rounded px-2 py-0.5 transition-all duration-500',
									activeSection === i.label && 'bg-zinc-200 text-[crimson]'
								)}
							>
								<Icon weight='duotone' size={16} />
								<p>{i.label}</p>
							</button>
						)
					})}
				</div>

				<Button onClick={() => handleLogoutUser()} isLoading={isLoggingOutUser} destructive className='w-fit self-end mr-4'>
					<DoorOpen color='crimson' weight='duotone' size={16} />
				</Button>
			</div>

			{/* Settings Content */}
			<div className='flex-1 border border-zinc-200 rounded-xl'></div>
			{/* <div className='flex-1'>
					<h1 className='text-2xl font-semibold mb-8'>{settingsSections.find((s) => s.id === activeSection)?.label}</h1>
					{activeSection === 'account' && <div className='space-y-6'>content</div>}
				</div> */}
		</div>
	)
}
