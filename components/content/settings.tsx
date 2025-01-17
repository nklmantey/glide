import { logoutUser } from '@/api'
import { useActiveTabStore, useSessionStore } from '@/store'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AppContainer } from '../global'
import { Button } from '../ui'
import { DoorOpen, User, Bell, Shield, Gear, PaintBrush } from '@phosphor-icons/react/dist/ssr'
import { useState } from 'react'

const settingsSections = [
	{ id: 'account', label: 'Account', icon: User },
	{ id: 'notifications', label: 'Notifications', icon: Bell },
	{ id: 'privacy', label: 'Privacy & Security', icon: Shield },
	{ id: 'preferences', label: 'Preferences', icon: Gear },
	{ id: 'appearance', label: 'Appearance', icon: PaintBrush },
]

export default function Settings() {
	const [activeSection, setActiveSection] = useState('account')
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

	return (
		<AppContainer>
			<div className='w-full h-full max-w-7xl mx-auto flex gap-12 p-6'>
				{/* Settings Navigation */}
				<div className='w-64 shrink-0'>
					<h2 className='text-lg font-semibold mb-6 px-2'>Settings</h2>
					<nav className='space-y-1'>
						{settingsSections.map((section) => (
							<button
								key={section.id}
								onClick={() => setActiveSection(section.id)}
								className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                  ${
										activeSection === section.id
											? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
											: 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
									}`}
							>
								<section.icon size={20} />
								<span>{section.label}</span>
							</button>
						))}
					</nav>
					<div className='mt-6 pt-6 border-t dark:border-gray-800'>
						<Button onClick={() => handleLogoutUser()} isLoading={isLoggingOutUser}>
							<DoorOpen weight='duotone' size={20} color='crimson' />
						</Button>
					</div>
				</div>

				{/* Settings Content */}
				<div className='flex-1'>
					<h1 className='text-2xl font-semibold mb-8'>{settingsSections.find((s) => s.id === activeSection)?.label}</h1>
					{activeSection === 'account' && <div className='space-y-6'>{/* Account settings content */}</div>}
					{/* Add other section contents similarly */}
				</div>
			</div>
		</AppContainer>
	)
}
