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
