'use client'

import { useRouter } from 'next/navigation'
import { Button } from '../ui'
import { ArrowLeft } from '@phosphor-icons/react'

type BackButtonProps = {
	iconOnly?: boolean
	route?: string
}

export default function BackButton({ iconOnly, route }: BackButtonProps) {
	const router = useRouter()

	return (
		<Button onClick={() => (route ? router.push(route) : router.back())}>
			<ArrowLeft />
			{!iconOnly && 'go back'}
		</Button>
	)
}
