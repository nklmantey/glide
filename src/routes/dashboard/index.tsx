import { AppContainer } from '@/components/global'
import { BottomTab } from '@/components/layouts'
import { DotPattern } from '@/components/ui'
import { useActiveTabStore } from '@/store'
import { Dashboard, Settings } from '@/components/content'

export function DashboardPage() {
	const { activeTab } = useActiveTabStore()

	const contentToRender = {
		0: <Dashboard />,
		2: <Settings />,
	}

	return (
		<AppContainer>
			<DotPattern className='h-screen w-screen' />

			<div className='relative w-full h-full items-start lg:items-center justify-center flex'>
				<BottomTab />

				<div className='w-full h-[80vh] lg:h-[85vh] items-center justify-center flex'>
					{contentToRender[activeTab as keyof typeof contentToRender]}
				</div>
			</div>
		</AppContainer>
	)
}
