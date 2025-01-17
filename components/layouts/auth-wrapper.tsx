'use client'

import { supabase } from '@/lib/supabase/client'
import { useOnboardingStore, useSessionStore } from '@/store'
import { Spinner } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

type AuthWrapperProps = {
	children: ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
	const router = useRouter()
	const { isOnboardingCompleted } = useOnboardingStore()
	const { setSession, session } = useSessionStore()
	const [isLoading, setIsLoading] = useState(true)

	async function getSession() {
		if (session) return

		const {
			data: { session: supabaseSession },
		} = await supabase.auth.getSession()

		supabase.auth.onAuthStateChange((_event, s) => {
			if (s) setSession(s)
		})

		if (supabaseSession) setSession(supabaseSession)

		setIsLoading(false)
	}

	useEffect(() => {
		getSession()
	}, [router])

	useEffect(() => {
		if (session) router.replace('/dashboard')

		if (!isLoading && !session) {
			isOnboardingCompleted ? router.replace('/auth/login') : router.replace('/')
		}
	}, [isLoading, session, router])

	if (isLoading) {
		return (
			<div className='min-h-screen w-screen items-center justify-center flex flex-col gap-2'>
				<Spinner weight='duotone' className='animate-spin' color='crimson' size={24} />
			</div>
		)
	}

	return <>{children}</>
}
