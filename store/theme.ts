import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

interface ThemeState {
	theme: Theme
	setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
	persist(
		(set) => ({
			theme: 'light',
			setTheme: (theme) => set({ theme }),
		}),
		{
			name: 'theme-storage',
		}
	)
)
