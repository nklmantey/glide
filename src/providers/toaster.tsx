import { useThemeStore } from '@/store'
import { Toaster } from 'sonner'
import { CheckCircleIcon, WarningCircleIcon, InfoIcon } from '@phosphor-icons/react'

export function ToasterProvider() {
	const { theme } = useThemeStore()

	return (
		<Toaster
			richColors
			icons={{
				success: <CheckCircleIcon weight='duotone' color='green' size={16} />,
				error: <WarningCircleIcon weight='duotone' color='crimson' size={16} />,
				info: <InfoIcon weight='duotone' color='cornflowerblue' size={16} />,
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
