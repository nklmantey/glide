import { Browsers } from '@phosphor-icons/react/dist/ssr'

export default function Logo() {
	return (
		<div className='flex items-center gap-2 bg-gray-100 hover:cursor-pointer transition-all duration-300 scroll-smooth p-1'>
			<Browsers weight='duotone' color='crimson' size={32} />
			<h1 className='font-medium text-base tracking-tighter'>glide.</h1>
		</div>
	)
}
