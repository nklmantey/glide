import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

type TanstackProviderProps = {
	children: ReactNode
}

export default function TanstackProvider({ children }: TanstackProviderProps) {
	const [queryClient] = useState(() => new QueryClient())

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
