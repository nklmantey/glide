import { Session } from '@supabase/supabase-js'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type SessionStoreType = {
	session: Session | null
	setSession: (session: Session | null) => void
}

export const useSessionStore = create(
	persist<SessionStoreType>(
		(set) => ({
			session: null,
			setSession: (session: Session | null) => set(() => ({ session })),
		}),
		{
			name: 'glide-session-store',
			storage: createJSONStorage(() => localStorage),
		}
	)
)
