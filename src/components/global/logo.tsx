import { RectangleStackIcon } from '@heroicons/react/16/solid'

type LogoProps = {
	iconOnly?: boolean
}

export default function Logo({ iconOnly }: LogoProps) {
	return (
		<div className='flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 hover:cursor-pointer transition-all duration-300 scroll-smooth px-2 py-1 rounded'>
			<RectangleStackIcon className='size-6 text-[crimson]' />
			{!iconOnly && <h1 className='font-medium text-base tracking-tighter text-zinc-800 dark:text-white'>glide.</h1>}
		</div>
	)
}
