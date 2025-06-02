import { BrowserRouter, Routes, Route } from 'react-router'

import App from '../App'
import { LoginPage, RegisterPage } from './auth'
import { DashboardPage } from './dashboard'
import { AuthWrapper } from '@/components/layouts'

export function Router() {
	return (
		<BrowserRouter>
			<AuthWrapper>
				<Routes>
					<Route path='/' element={<App />} />
					<Route path='auth'>
						<Route path='login' element={<LoginPage />} />
						<Route path='register' element={<RegisterPage />} />
					</Route>

					<Route path='dashboard' element={<DashboardPage />} />
				</Routes>
			</AuthWrapper>
		</BrowserRouter>
	)
}
