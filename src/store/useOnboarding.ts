import { storage } from '@/lib/storage'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type OnboardingStoreType = {
	isOnboardingCompleted: boolean
	setIsOnboardingCompleted: (isOnboardingCompleted: boolean) => void
}

export const useOnboardingStore = create(
	persist<OnboardingStoreType>(
		(set) => ({
			isOnboardingCompleted: false,
			setIsOnboardingCompleted: (isOnboardingCompleted: boolean) => set(() => ({ isOnboardingCompleted })),
		}),
		{
			name: 'glide-onboarding-store',
			storage: createJSONStorage(() => storage),
		}
	)
)
