import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { useProfileStore } from '@/store'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteProfile } from '@/api'
import { Button } from '@/components/ui'
import { TrashIcon, ExclamationCircleIcon } from '@heroicons/react/16/solid'

type DeleteProfileDialogProps = {
	id: string
	isDialogOpen: boolean
	setIsDialogOpen: (isDialogOpen: boolean) => void
}

export function DeleteProfileDialog({ isDialogOpen, setIsDialogOpen, id }: DeleteProfileDialogProps) {
	const { removeProfile, profiles } = useProfileStore()
	const profileToDelete = profiles.find((profile) => profile.id === id)

	const { mutate: handleDeleteProfile, isPending: isDeletingProfile } = useMutation({
		mutationKey: deleteProfile.key,
		mutationFn: deleteProfile.fn,
		onSuccess: () => {
			toast.success('profile deleted!')
			setIsDialogOpen(false)
			removeProfile(id)
		},
	})

	if (!profileToDelete) return null

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle className='text-zinc-800 dark:text-white'></DialogTitle>
				</DialogHeader>

				<div className='flex flex-col items-center justify-center gap-2 py-4 text-center'>
					<div className='flex items-center justify-center gap-2'>
						<ExclamationCircleIcon className='size-4 text-red-600 dark:text-red-500' />
						<p className='text-[crimson] dark:text-red-400'>are you sure you want to delete</p>
					</div>
					<div className='flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded w-fit self-center'>
						<span className='text-sm text-zinc-900 dark:text-white'>
							{profileToDelete.emoji} {profileToDelete.profile_name}
						</span>
					</div>
					<p className='text-sm text-zinc-500 dark:text-zinc-400 mt-2'>
						this action cannot be undone and will permanently delete this profile and its settings.
					</p>
				</div>

				<div className='flex w-full justify-center gap-2 border-t border-zinc-200 dark:border-zinc-700 pt-4'>
					<Button onClick={() => setIsDialogOpen(false)}>cancel</Button>
					<Button onClick={() => handleDeleteProfile({ profileId: id })} isLoading={isDeletingProfile} destructive>
						{!isDeletingProfile && <TrashIcon className='size-4' />}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
