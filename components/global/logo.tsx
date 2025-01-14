import { CardsThree } from '@phosphor-icons/react/dist/ssr'

type LogoProps = {
	iconOnly?: boolean
}

export default function Logo({ iconOnly }: LogoProps) {
	return (
		<div className='flex items-center gap-2 bg-gray-100 hover:cursor-pointer transition-all duration-300 scroll-smooth px-2 py-1 rounded'>
			<CardsThree weight='duotone' color='crimson' size={32} />
			{!iconOnly && (
				<h1 className='font-medium text-base tracking-tighter'>glide.</h1>
			)}
		</div>
	)
}
