import { storage } from '@/lib/storage'
import { AppInfo } from '@/types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Profile = {
	created_at: string
	emoji: string
	id: string
	profile_name: string
	selected_apps: AppInfo[]
	updated_at: string
	user_id: string
}

type ProfileStoreType = {
	activeProfile: Profile | null
	setActiveProfile: (activeProfile: Profile | null) => void
	profiles: Profile[] | []
	setProfiles: (profiles: Profile[] | []) => void
	addProfile: (profile: Profile) => void
	removeProfile: (id: string) => void
}

export const useProfileStore = create(
	persist<ProfileStoreType>(
		(set, get) => ({
			activeProfile: null,
			setActiveProfile: (activeProfile: Profile | null) => set(() => ({ activeProfile })),
			profiles: [],
			setProfiles: (profiles: Profile[] | []) => set(() => ({ profiles })),
			addProfile: (profile: Profile) => set(() => ({ profiles: [...get().profiles, profile] })),
			removeProfile: (id: string) => set(() => ({ profiles: get().profiles.filter((profile) => profile.id !== id) })),
		}),
		{
			name: 'glide-profile-store',
			storage: createJSONStorage(() => storage),
		}
	)
)
