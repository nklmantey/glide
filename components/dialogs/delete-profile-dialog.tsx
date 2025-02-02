import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { useProfileStore } from '@/store'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteProfile } from '@/api'
import { Button } from '../ui'
import { Trash } from '@phosphor-icons/react'

type DeleteProfileDialogProps = {
	id: string
	isDialogOpen: boolean
	setIsDialogOpen: (isDialogOpen: boolean) => void
}

export default function DeleteProfileDialog({ isDialogOpen, setIsDialogOpen, id }: DeleteProfileDialogProps) {
	const { removeProfile } = useProfileStore()

	const { mutate: handleDeleteProfile, isPending: isDeletingProfile } = useMutation({
		mutationKey: deleteProfile.key,
		mutationFn: deleteProfile.fn,
		onSuccess: () => {
			toast.success('profile deleted!')
			setIsDialogOpen(false)
			removeProfile(id)
		},
	})

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>are your sure you want to delete profile?</DialogTitle>
				</DialogHeader>

				<p>this action is irreversible</p>

				<div className='flex w-full justify-center gap-2 mt-4'>
					<Button onClick={() => setIsDialogOpen(false)}>cancel</Button>
					<Button
						onClick={() => {
							handleDeleteProfile({ profileId: id })
						}}
						isLoading={isDeletingProfile}
						destructive
					>
						<Trash weight='duotone' size={16} />
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
