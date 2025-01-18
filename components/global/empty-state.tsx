import Image from 'next/image'

type EmptyStateProps = {
	message?: string
}

export default function EmptyState({ message }: EmptyStateProps) {
	return (
		<div className='flex flex-col gap-2 items-center justify-center'>
			<Image src='/empty.svg' alt='empty-profile-state' width={200} height={200} className='saturate-[200%] grayscale opacity-50' />
			<p className='text-zinc-400'>{message}</p>
		</div>
	)
}
