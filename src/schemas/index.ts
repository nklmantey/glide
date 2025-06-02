import { z } from 'zod'

export const LoginInputSchema = z.object({
	email: z.string().email({ message: 'email is required' }),
	password: z.string({ required_error: 'password is required' }).min(1, 'password is required'),
})

export const RegisterInputSchema = z.object({
	name: z.string({ required_error: 'your name is required' }),
	email: z.string().email({ message: 'your email is required' }),
	password: z
		.string({ required_error: 'your password is required' })
		.min(8, 'your password should be minimum 8 characters')
		.regex(/(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, 'password must contain at least one uppercase letter and one special character'),
})

// INFERED TYPES
export type LoginInputType = z.infer<typeof LoginInputSchema>
export type RegisterInputType = z.infer<typeof RegisterInputSchema>
export type VerifyOtpInputType = {
	email: string
	otp: string
}
