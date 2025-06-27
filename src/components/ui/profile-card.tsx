import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { BoltIcon, TrashIcon } from '@heroicons/react/16/solid'
import { ProfileCardProps } from '@/types'
import { invoke } from '@tauri-apps/api/tauri'

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
						'group hover:cursor-pointer transition-all duration-500 flex flex-col items-start justify-start border w-full p-4 gap-4 rounded-lg relative bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md',
						isActive
							? 'border-[green]/50 dark:border-[green]/30'
							: 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
					)}
				>
					{isActive && (
						<div className='absolute -top-1.5 -right-1.5'>
							<span className='flex h-3 w-3'>
								<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 dark:bg-green-500 opacity-75'></span>
								<span className='relative inline-flex rounded-full h-3 w-3 bg-green-500 dark:bg-green-400'></span>
							</span>
						</div>
					)}
					<div className='flex items-center gap-2 w-full'>
						<div className='flex items-center gap-2 bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded'>
							<span className='text-xs'>{profile.emoji}</span>
						</div>
						<div className='flex items-center gap-2 bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded'>
							<span className='text-xs text-zinc-500 dark:text-zinc-400'>{profile.profile_name}</span>
						</div>
						{profile.selected_apps.length > 0 && (
							<div className='flex items-center gap-2 bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded'>
								<span className='text-xs text-zinc-500 dark:text-zinc-400'>
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
									'inline-flex items-center px-2 py-1.5 rounded-md gap-2',
									'transition-all duration-200 ease-in-out',
									'border border-transparent',
									isActive
										? 'bg-[green]/10 dark:bg-[green]/5 ring-1 ring-[green]/50 dark:ring-[green]/30'
										: 'bg-zinc-50 dark:bg-zinc-700/50 group-hover:bg-[green]/5 dark:group-hover:bg-[green]/5 hover:border-[green]/20 dark:hover:border-[green]/10'
								)}
							>
								{app.icon ? (
									<img src={app.icon} alt={`${app.name} icon`} className='w-5 h-5 shrink-0' />
								) : (
									<div className='w-5 h-5 bg-zinc-200 dark:bg-zinc-600 rounded-md shrink-0' />
								)}
								<span className='text-sm text-zinc-700 dark:text-zinc-300 whitespace-nowrap'>{app.name}</span>
							</div>
						))}
					</div>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent side='right' className='dark:bg-zinc-800 dark:border-zinc-700'>
				<DropdownMenuItem
					className='flex items-center gap-1 data-[disabled]:opacity-50 dark:text-zinc-300 dark:focus:bg-zinc-700/50'
					onClick={handleSetActiveProfile}
					disabled={isActive}
				>
					<BoltIcon className={cn('size-4', isActive ? 'text-[darkgoldenrod]' : 'text-[#b8860b]')} />
					{isActive ? 'currently active' : 'set as active'}
				</DropdownMenuItem>
				<DropdownMenuItem
					className='flex items-center gap-1 dark:text-zinc-300 dark:focus:bg-zinc-700/50'
					onClick={() => onDelete(profile.id)}
				>
					<TrashIcon className='size-4 text-[crimson]' />
					delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
