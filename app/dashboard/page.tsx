'use client'

import { AppContainer } from '@/components/global'
import { BottomTab } from '@/components/layouts/bottom-tab'
import DotPattern from '@/components/ui/dot-pattern'
import { useActiveTabStore } from '@/store'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Dashboard } from '@/components/content'

export default function DashboardPage() {
	const router = useRouter()
	const { activeTab } = useActiveTabStore()

	const contentToRender = {
		0: <Dashboard />,
	}

	return (
		<AppContainer>
			<DotPattern className='h-screen w-screen' />

			<div className='relative w-full h-full items-start lg:items-center justify-center flex'>
				<BottomTab />

				<div className='w-full h-[85vh] items-center justify-center flex'>{contentToRender[activeTab as keyof typeof contentToRender]}</div>
			</div>
		</AppContainer>
	)
}
