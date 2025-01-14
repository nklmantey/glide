'use client'

import { useRouter } from 'next/navigation'

export default function DashboardPage() {
	const router = useRouter()

	return <div onClick={() => router.replace('/')}>DashboardPage</div>
}
