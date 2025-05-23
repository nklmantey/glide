import { ReactNode } from 'react'

type AppContainerProps = {
	children: ReactNode
}

export default function AppContainer({ children }: AppContainerProps) {
	return <div className='p-4 h-screen w-full overflow-hidden'>{children}</div>
}
