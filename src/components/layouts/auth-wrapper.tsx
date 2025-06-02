import { supabase } from '@/lib/supabase/client'
import { useOnboardingStore, useSessionStore } from '@/store'
import { SpinnerIcon } from '@phosphor-icons/react'
import { ReactNode, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

type AuthWrapperProps = {
	children: ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
	const navigate = useNavigate()

	const { isOnboardingCompleted } = useOnboardingStore()
	const { setSession, session } = useSessionStore()
	const [isLoading, setIsLoading] = useState(true)

	async function getSession() {
		const {
			data: { session: supabaseSession },
		} = await supabase.auth.getSession()

		supabase.auth.onAuthStateChange((_event, s) => {
			if (s) {
				setSession(s)
				navigate('/dashboard', { replace: true })
			}
		})

		if (supabaseSession) {
			setSession(supabaseSession)
			navigate('/dashboard', { replace: true })
		}

		setIsLoading(false)
	}

	useEffect(() => {
		getSession()
	}, [])

	if (isLoading) {
		return (
			<div className='min-h-screen w-screen items-center justify-center flex flex-col gap-2'>
				<SpinnerIcon weight='duotone' className='animate-spin' color='crimson' size={24} />
			</div>
		)
	}

	if (!isLoading && !session) {
		isOnboardingCompleted ? navigate('/auth/login', { replace: true }) : navigate('/', { replace: true })
	}

	return <>{children}</>
}
