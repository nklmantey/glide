import Image from 'next/image'
import { BorderBeam } from '../ui/border-beam'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { tauri } from '@tauri-apps/api'
interface AppInfo {
	name: string
	path: string
	bundle_id?: string
	icon?: any
}
export default function Dashboard() {
	return (
		<div className='w-full h-full grid grid-cols-3 max-w-4xl gap-[2px]'>
			<div className='relative col-span-2 row-span-1 lg:row-span-2 border border-zinc-200 p-4 bg-white rounded-xl'>
				<CurrentProfile />
				<BorderBeam size={350} duration={12} delay={9} />
			</div>
			<div className='col-span-1 row-span-2 lg:row-span-3 border border-zinc-200 p-4 bg-white rounded-xl'>B</div>
			<div className='col-span-2 row-span-1 border border-zinc-200 p-4 bg-white rounded-xl'>profiles overview (crud)</div>
		</div>
	)
}

function CurrentProfile() {
	const [isLoadingInstalledApps, setIsLoadingInstalledApps] = useState(false)
	const [_, setGetInstalledAppsError] = useState('')
	const [requesGetInstalledApplications, setRequesGetInstalledApplications] = useState(false)

	const [apps, setApps] = useState<AppInfo[] | null>(null)

	async function loadApps() {
		try {
			setIsLoadingInstalledApps(true)
			const installedApps = await tauri.invoke<AppInfo[]>('get_installed_apps')
			setApps(installedApps)
		} catch (err) {
			setGetInstalledAppsError(err instanceof Error ? err.message : 'Failed to load apps')
		} finally {
			setIsLoadingInstalledApps(false)
		}
	}

	useEffect(() => {
		if (requesGetInstalledApplications) loadApps()
	}, [requesGetInstalledApplications])

	return (
		<div className='flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center space-y-6'>
			<h1 className='text-2xl font-medium text-zinc-800'>current active profile</h1>

			{!apps && (
				<>
					<p className='text-zinc-500'>you have no active profile.</p>
					<div className='py-6'>
						<Image src='/empty.svg' alt='empty-profile-state' width={200} height={200} className='saturate-[200%] grayscale opacity-80' />
					</div>
					<Button onClick={() => setRequesGetInstalledApplications(true)} isLoading={isLoadingInstalledApps}>
						create profile
					</Button>
				</>
			)}

			{apps && (
				<div className='flex flex-wrap items-center gap-2'>
					{apps.map((app) => (
						<div key={app.path} className='flex items-center bg-zinc-100 px-2 py-1 rounded gap-2 hover:bg-zinc-200 cursor-pointer'>
							{app.icon ? (
								<img src={app.icon} alt={`${app.name} icon`} className='w-4 h-4' />
							) : (
								<div className='w-4 h-4 bg-zinc-200 rounded' />
							)}
							<span className='text-sm text-zinc-700 text-center line-clamp-2'>{app.name}</span>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
