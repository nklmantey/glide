import { Session } from '@supabase/supabase-js'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type SessionStoreType = {
	session: Session | null
	setSession: (session: Session) => void
}

export const useSessionStore = create(
	persist<SessionStoreType>(
		(set) => ({
			session: null,
			setSession: (session: Session) => set(() => ({ session })),
		}),
		{
			name: 'glide-session-store',
			storage: createJSONStorage(() => sessionStorage),
		}
	)
)
