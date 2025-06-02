import { supabase } from '@/lib/supabase/client'
import { useOnboardingStore, useSessionStore } from '@/store'
import { SpinnerIcon } from '@phosphor-icons/react'
import { ReactNode, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

type AuthWrapperProps = {
	children: ReactNode
}

const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/register']

export function AuthWrapper({ children }: AuthWrapperProps) {
	const navigate = useNavigate()
	const location = useLocation()
	const { isOnboardingCompleted } = useOnboardingStore()
	const { setSession, session } = useSessionStore()
	const [isLoading, setIsLoading] = useState(true)

	const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname)

	async function getSession() {
		try {
			if (session) {
				setIsLoading(false)
				navigate('/dashboard', { replace: true })
				return
			}

			const {
				data: { session: supabaseSession },
			} = await supabase.auth.getSession()

			supabase.auth.onAuthStateChange((_event, s) => {
				if (s) {
					setSession(s)
					if (!isPublicRoute) {
						navigate('/dashboard', { replace: true })
					}
				}
			})

			if (supabaseSession) {
				setSession(supabaseSession)
				if (!isPublicRoute) {
					navigate('/dashboard', { replace: true })
				}
			}
		} catch (error) {
			console.error('Error getting session:', error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		getSession()
	}, [session])

	if (isLoading) {
		return (
			<div className='min-h-screen w-screen items-center justify-center flex flex-col gap-2'>
				<SpinnerIcon weight='duotone' className='animate-spin' color='crimson' size={24} />
			</div>
		)
	}

	if (isPublicRoute) {
		return <>{children}</>
	}

	if (!session) {
		isOnboardingCompleted ? navigate('/auth/login', { replace: true }) : navigate('/', { replace: true })
		return null
	}

	return <>{children}</>
}
