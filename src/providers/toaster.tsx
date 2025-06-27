import { useThemeStore } from '@/store'
import { Toaster } from 'sonner'
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/16/solid'

export function ToasterProvider() {
	const { theme } = useThemeStore()

	return (
		<Toaster
			richColors
			icons={{
				success: <CheckCircleIcon className='size-4 text-[green]' />,
				error: <ExclamationCircleIcon className='size-4 text-[crimson]' />,
				info: <InformationCircleIcon className='size-4 text-[cornflowerblue]' />,
			}}
			theme={theme}
			visibleToasts={1}
			toastOptions={{
				classNames: {
					content: 'font-regular tracking-normal',
				},
			}}
		/>
	)
}
