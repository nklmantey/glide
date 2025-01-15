'use client'

import { LoginForm } from '@/components/forms'
import { AppContainer, BackButton, Logo } from '@/components/global'

export default function LoginPage() {
	return (
		<AppContainer>
			<div className='h-full w-full flex flex-col items-center justify-center gap-8'>
				<div className='flex gap-1 items-center'>
					<BackButton iconOnly route='/' />
					<Logo iconOnly />
				</div>
				<LoginForm />
			</div>
		</AppContainer>
	)
}
