'use client'

import { logoutUser } from '@/api'
import { AppContainer } from '@/components/global'
import { Button } from '@/components/ui'
import { useSessionStore } from '@/store'
import { SignOut } from '@phosphor-icons/react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function DashboardPage() {
	const { session, setSession } = useSessionStore()
	const router = useRouter()

	const { mutate: handleLogoutUser, isPending: isLoggingOutUser } = useMutation({
		mutationKey: logoutUser.key,
		mutationFn: logoutUser.fn,
		onSuccess: () => {
			setSession(null)
			router.replace('/auth/login')
		},
		onError: (e) => {
			toast.error(e?.message?.toLowerCase())
		},
	})

	return (
		<AppContainer>
			<p>welcome {session && session.user.user_metadata?.name}</p>

			<Button onClick={() => handleLogoutUser()} isLoading={isLoggingOutUser}>
				<SignOut weight='duotone' size={20} color='crimson' />
			</Button>
		</AppContainer>
	)
}
