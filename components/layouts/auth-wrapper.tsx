'use client'

import { createClient } from '@/lib/supabase/client'
import { useOnboardingStore } from '@/store'
import { Spinner } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

type AuthWrapperProps = {
	children: ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
	const router = useRouter()
	const { isOnboardingCompleted, setIsOnboardingCompleted } =
		useOnboardingStore()
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	const supabase = createClient()

	async function getSession() {
		const {
			data: { session },
		} = await supabase.auth.getSession()

		setIsAuthenticated(!!session)
		setIsLoading(false)
	}

	useEffect(() => {
		getSession()
		// setIsOnboardingCompleted(false)
	}, [])

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			isOnboardingCompleted
				? router.replace('/auth/login')
				: router.replace('/')
		}
	}, [isLoading, isAuthenticated, router])

	if (isLoading) {
		return (
			<div className='min-h-screen w-screen items-center justify-center flex flex-col gap-2'>
				<Spinner
					weight='duotone'
					className='animate-spin'
					color='crimson'
					size={24}
				/>
			</div>
		)
	}

	return <>{children}</>
}
