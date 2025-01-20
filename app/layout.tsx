import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { cn } from '@/lib/utils'
import { AuthWrapper } from '@/components/layouts'
import TanstackProvider from '@/providers/tanstack'
import { Toaster } from 'sonner'
import { CheckCircle, WarningCircle, Info } from '@phosphor-icons/react/dist/ssr'

const berkeley = localFont({
	src: '../public/assets/fonts/Berkeley.otf',
	variable: '--font-berkeley',
})

const hafferBold = localFont({
	src: '../public/assets/fonts/Haffer-Bold.woff2',
	variable: '--font-haffer-bold',
})

const hafferRegular = localFont({
	src: '../public/assets/fonts/Haffer-Regular.woff2',
	variable: '--font-haffer-regular',
})

const hafferSemibold = localFont({
	src: '../public/assets/fonts/Haffer-Semibold.woff2',
	variable: '--font-haffer-semibold',
})

export const metadata: Metadata = {
	title: 'glide',
	description: 'Generated by create next app',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body
				className={cn(
					berkeley.variable,
					hafferRegular.className,
					hafferBold.variable,
					hafferSemibold.variable,
					'antialiased min-h-screen w-screen text-[12px] md:text-sm tracking-tight bg-[#f9f9f9]'
				)}
			>
				<TanstackProvider>
					<Toaster
						richColors
						icons={{
							success: <CheckCircle weight='duotone' color='green' size={16} />,
							error: <WarningCircle weight='duotone' color='crimson' size={16} />,
							info: <Info weight='duotone' color='cornflowerblue' size={16} />,
						}}
						className='font-regular tracking-normal'
					/>
					<AuthWrapper>{children}</AuthWrapper>
				</TanstackProvider>
			</body>
		</html>
	)
}
