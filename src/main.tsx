import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Router } from '@/routes'
import TanstackProvider from '@/providers/tanstack'
import { Toaster } from 'sonner'
import { CheckCircleIcon, WarningCircleIcon, InfoIcon } from '@phosphor-icons/react'
import { ThemeProvider } from 'next-themes'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<ThemeProvider attribute='class' defaultTheme='light'>
			<TanstackProvider>
				<Toaster
					richColors
					icons={{
						success: <CheckCircleIcon weight='duotone' color='green' size={16} />,
						error: <WarningCircleIcon weight='duotone' color='crimson' size={16} />,
						info: <InfoIcon weight='duotone' color='cornflowerblue' size={16} />,
					}}
					visibleToasts={1}
					toastOptions={{
						classNames: {
							content: 'font-regular tracking-normal',
						},
					}}
				/>
				<Router />
			</TanstackProvider>
		</ThemeProvider>
	</React.StrictMode>
)
