import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type ActiveTabType = {
	activeTab: number
	setActiveTab: (tab: number) => void
}

export const useActiveTabStore = create(
	persist<ActiveTabType>(
		(set) => ({
			activeTab: 0,
			setActiveTab: (activeTab: number) => set(() => ({ activeTab })),
		}),
		{
			name: 'glide-activetab-store',
			storage: createJSONStorage(() => localStorage),
		}
	)
)
