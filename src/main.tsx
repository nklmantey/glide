import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Router } from '@/routes'
import TanstackProvider from '@/providers/tanstack'
import { ThemeProvider } from 'next-themes'
import { ToasterProvider } from '@/providers/toaster'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<ThemeProvider attribute='class' defaultTheme='light'>
			<TanstackProvider>
				<ToasterProvider />
				<Router />
			</TanstackProvider>
		</ThemeProvider>
	</React.StrictMode>
)
