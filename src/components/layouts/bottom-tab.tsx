import { ExpandableTabs } from '@/components/ui/expandable-tabs'
import { HomeIcon, Cog6ToothIcon } from '@heroicons/react/16/solid'

export function BottomTab() {
	const tabs = [{ title: 'home', icon: HomeIcon }, { type: 'separator' }, { title: 'settings', icon: Cog6ToothIcon }]

	return (
		<div className='absolute bottom-2 lg:bottom-0'>
			<ExpandableTabs tabs={tabs as []} />
		</div>
	)
}
