'use client'

import { useRouter } from 'next/navigation'
import { Button } from '../ui'
import { ArrowLeft } from '@phosphor-icons/react'

type BackButtonProps = {
	iconOnly?: boolean
}

export default function BackButton({ iconOnly }: BackButtonProps) {
	const router = useRouter()

	return (
		<Button onClick={() => router.back()}>
			<ArrowLeft />
			{!iconOnly && 'go back'}
		</Button>
	)
}
