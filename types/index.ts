export type AppInfo = {
	name: string
	path: string
	bundle_id?: string
	icon?: any
}

export type FormState = {
	name: string
	emoji: string
	selectedApps: AppInfo[]
}

export type SupabaseProfileRow = {
	profile_name: string
	emoji: string
	selected_apps: AppInfo[]
}

export type ProfileCardProps = {
	profile: {
		id: string
		emoji: string
		profile_name: string
		selected_apps: AppInfo[]
	}
	isActive: boolean
	onSetActive: (profile: any) => void
	onDelete: (id: string) => void
}
