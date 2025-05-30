import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { useProfileStore } from '@/store'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteProfile } from '@/api'
import { Button } from '../ui'
import { Trash, WarningCircle } from '@phosphor-icons/react'

type DeleteProfileDialogProps = {
	id: string
	isDialogOpen: boolean
	setIsDialogOpen: (isDialogOpen: boolean) => void
}

export default function DeleteProfileDialog({ isDialogOpen, setIsDialogOpen, id }: DeleteProfileDialogProps) {
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
					<DialogTitle></DialogTitle>
				</DialogHeader>

				<div className='flex flex-col items-center justify-center gap-2 py-4 text-center'>
					<div className='flex items-center justify-center gap-2'>
						<WarningCircle className='text-red-600' weight='duotone' size={20} />
						<p className='text-[crimson]'>are you sure you want to delete</p>
					</div>
					<div className='flex items-center gap-2 bg-zinc-100 px-2 py-1 rounded w-fit self-center'>
						<span className='text-sm text-zinc-900'>
							{profileToDelete.emoji} {profileToDelete.profile_name}
						</span>
					</div>
					<p className='text-sm text-zinc-500 mt-2'>
						this action cannot be undone and will permanently delete this profile and its settings.
					</p>
				</div>

				<div className='flex w-full justify-center gap-2 border-t pt-4'>
					<Button onClick={() => setIsDialogOpen(false)}>cancel</Button>
					<Button onClick={() => handleDeleteProfile({ profileId: id })} isLoading={isDeletingProfile} destructive>
						{!isDeletingProfile && <Trash weight='duotone' size={16} />}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
