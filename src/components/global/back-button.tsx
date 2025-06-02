import { Button } from '@/components/ui'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router'

type BackButtonProps = {
	iconOnly?: boolean
	route?: string
}

export default function BackButton({ iconOnly, route }: BackButtonProps) {
	const navigate = useNavigate()

	return (
		<Button onClick={() => (route ? navigate(route) : navigate(-1))}>
			<ArrowLeftIcon />
			{!iconOnly && 'go back'}
		</Button>
	)
}
