import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Lightning, Trash } from '@phosphor-icons/react'
import { AppInfo } from '@/types'
import { invoke } from '@tauri-apps/api/tauri'

interface ProfileCardProps {
	profile: {
		id: string
		emoji: string
		profile_name: string
		selected_apps: AppInfo[]
	}
	isActive: boolean
	onSetActive: (profile: any) => void
	onDelete: (id: string) => void
}

export function ProfileCard({ profile, isActive, onSetActive, onDelete }: ProfileCardProps) {
	const handleSetActiveProfile = async () => {
		onSetActive(profile)
		if (profile.selected_apps) {
			try {
				await invoke('open_apps', {
					appPaths: profile.selected_apps.map((app: any) => app.path),
				})
			} catch (error) {
				console.error('Failed to open apps:', error)
			}
		}
	}

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<div
					className={cn(
						'group hover:cursor-pointer transition-all duration-500 flex flex-col items-start justify-start border w-full p-4 gap-4 rounded-lg relative bg-white shadow-sm hover:shadow-md',
						isActive ? 'border border-[green]/50' : 'hover:border-zinc-300'
					)}
				>
					{isActive && (
						<div className='absolute -top-1.5 -right-1.5'>
							<span className='flex h-3 w-3'>
								<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
								<span className='relative inline-flex rounded-full h-3 w-3 bg-green-500'></span>
							</span>
						</div>
					)}
					<div className='flex items-center gap-2 w-full'>
						<div className='flex items-center gap-2 bg-zinc-100 px-2 py-1 rounded'>
							<span className='text-xs'>{profile.emoji}</span>
						</div>
						<div className='flex items-center gap-2 bg-zinc-100 px-2 py-1 rounded'>
							<span className='text-xs text-zinc-500'>{profile.profile_name}</span>
						</div>
						{profile.selected_apps.length > 0 && (
							<div className='flex items-center gap-2 bg-zinc-100 px-2 py-1 rounded'>
								<span className='text-xs text-zinc-500'>
									{profile.selected_apps.length} {profile.selected_apps.length === 1 ? 'app' : 'apps'}
								</span>
							</div>
						)}
					</div>
					<div className='flex flex-wrap gap-2 w-full'>
						{profile.selected_apps.map((app) => (
							<div
								key={app.path}
								className={cn(
									'inline-flex items-center px-2 py-1.5 rounded-md gap-2 group-hover:bg-[green]/5',
									'transition-all duration-200 ease-in-out',
									'border border-transparent hover:border-[green]/20',
									isActive ? 'bg-[green]/10 ring-1 ring-[green]' : 'bg-zinc-50'
								)}
							>
								{app.icon ? (
									<img src={app.icon} alt={`${app.name} icon`} className='w-5 h-5 shrink-0' />
								) : (
									<div className='w-5 h-5 bg-zinc-200 rounded-md shrink-0' />
								)}
								<span className='text-sm text-zinc-700 whitespace-nowrap'>{app.name}</span>
							</div>
						))}
					</div>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent side='right'>
				<DropdownMenuItem
					className='flex items-center gap-1 data-[disabled]:opacity-50'
					onClick={handleSetActiveProfile}
					disabled={isActive}
				>
					<Lightning color='darkgoldenrod' weight='duotone' size={16} />
					{isActive ? 'currently active' : 'set as active'}
				</DropdownMenuItem>
				<DropdownMenuItem className='flex items-center gap-1' onClick={() => onDelete(profile.id)}>
					<Trash color='crimson' weight='duotone' size={16} />
					delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
