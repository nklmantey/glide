import { HouseLine, Gear, ArrowsClockwise, Lightbulb, User, BellRinging } from '@phosphor-icons/react/dist/ssr'
import { ExpandableTabs } from '../ui/expandable-tabs'

export function BottomTab() {
	const tabs = [
		{ title: 'home', icon: HouseLine },
		{ title: 'profile', icon: User },
		{ type: 'separator' },
		{ title: 'notifications', icon: BellRinging },
		{ title: 'settings', icon: Gear },
		{ type: 'separator' },
		{ title: 'insights', icon: Lightbulb },
		{ title: 'sync', icon: ArrowsClockwise },
	]

	return (
		<div className='absolute bottom-6 lg:bottom-0'>
			<ExpandableTabs tabs={tabs as []} />
		</div>
	)
}
