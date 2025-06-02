import { HouseLineIcon, GearIcon } from '@phosphor-icons/react'
import { ExpandableTabs } from '@/components/ui/expandable-tabs'

export function BottomTab() {
	const tabs = [{ title: 'home', icon: HouseLineIcon }, { type: 'separator' }, { title: 'settings', icon: GearIcon }]

	return (
		<div className='absolute bottom-2 lg:bottom-0'>
			<ExpandableTabs tabs={tabs as []} />
		</div>
	)
}
