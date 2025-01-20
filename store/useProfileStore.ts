import { AppInfo, FormState } from '@/types'
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
	profiles: Profile[] | []
	addProfile: (profile: Profile) => void
	setProfiles: (profiles: Profile[] | []) => void
	removeProfile: (id: string) => void
}

export const useProfileStore = create(
	persist<ProfileStoreType>(
		(set, get) => ({
			profiles: [],
			addProfile: (profile: Profile) => set(() => ({ profiles: [...get().profiles, profile] })),
			setProfiles: (profiles: Profile[] | []) => set(() => ({ profiles })),
			removeProfile: (id: string) => set(() => ({ profiles: get().profiles.filter((profile) => profile.id !== id) })),
		}),
		{
			name: 'glide-profile-store',
			storage: createJSONStorage(() => localStorage),
		}
	)
)
