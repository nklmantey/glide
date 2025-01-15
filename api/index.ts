import { supabase } from '@/lib/supabase/client'
import { LoginInputType, RegisterInputType, VerifyOtpInputType } from '@/schemas'

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
