import { supabase } from '@/lib/supabase/client'
import { LoginInputType, RegisterInputType, VerifyOtpInputType } from '@/schemas'
import { SupabaseProfileRow } from '@/types'

export const registerUser = {
	key: ['registerUser'],
	fn: async (input: RegisterInputType) => {
		const { error, data } = await supabase.auth.signUp({
			...input,
			options: {
				data: {
					name: input.name,
				},
			},
		})

		if (error) throw new Error(error.message)

		if (data?.user?.identities?.length === 0) throw new Error('user with this email already exists')

		return { status: 'success', data: data.user }
	},
}

export const verifyUserEmail = {
	key: ['verifyUserEmail'],
	fn: async (input: VerifyOtpInputType) => {
		const { error, data } = await supabase.auth.verifyOtp({
			email: input.email,
			token: input.otp,
			type: 'email',
		})

		if (error) throw new Error(error.message)

		return { status: 'success', data: data.user }
	},
}

export const loginUser = {
	key: ['loginUser'],
	fn: async (input: LoginInputType) => {
		const { error, data } = await supabase.auth.signInWithPassword({ ...input })

		if (error) throw new Error(error.message)

		return { status: 'success', data: data.user }
	},
}

export const logoutUser = {
	key: ['loginUser'],
	fn: async () => {
		const { error } = await supabase.auth.signOut()

		if (error) throw new Error(error.message)
	},
}

export const saveProfile = {
	key: ['saveProfile'],
	fn: async (input: SupabaseProfileRow) => {
		const { data, error } = await supabase.from('profiles').insert(input).select()
		if (error) throw new Error(error.message)

		return data[0]
	},
}

export const deleteProfile = {
	key: ['deleteProfile'],
	fn: async ({ profileId }: { profileId: string }) => {
		const { error } = await supabase.from('profiles').delete().eq('id', profileId)

		if (error) throw new Error(error.message)
	},
}

export const getUserProfiles = {
	key: ['getUserProfiles'],
	fn: async ({ id }: { id: string }) => {
		const { data, error } = await supabase.from('profiles').select('*').eq('user_id', id)
		if (error) throw new Error(error.message)

		return data
	},
}
