import { Button } from '@/components/ui'
import { ArrowLeftIcon } from '@heroicons/react/16/solid'
import { useNavigate } from 'react-router'

type BackButtonProps = {
	iconOnly?: boolean
	route?: string
}

export default function BackButton({ iconOnly, route }: BackButtonProps) {
	const navigate = useNavigate()

	return (
		<Button onClick={() => (route ? navigate(route) : navigate(-1))}>
			<ArrowLeftIcon className='size-4 text-zinc-400' />
			{!iconOnly && 'go back'}
		</Button>
	)
}
