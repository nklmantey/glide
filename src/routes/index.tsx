import { BrowserRouter, Routes, Route } from 'react-router'

import App from '../App'
import { LoginPage, RegisterPage } from './auth'
import { DashboardPage } from './dashboard'
import { AuthWrapper } from '@/components/layouts'

export function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<App />} />
				<Route path='auth/login' element={<LoginPage />} />
				<Route path='auth/register' element={<RegisterPage />} />

				<Route
					path='dashboard'
					element={
						<AuthWrapper>
							<DashboardPage />
						</AuthWrapper>
					}
				/>
			</Routes>
		</BrowserRouter>
	)
}
