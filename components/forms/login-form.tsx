import { useForm } from 'react-hook-form'
import { Button, Input } from '../ui'
import Link from 'next/link'
import { LoginInputSchema, LoginInputType } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { loginUser, verifyUserEmail } from '@/api'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Info } from '@phosphor-icons/react/dist/ssr'
import { OtpInput } from '../global'
import { useState } from 'react'
import { Spinner } from '@phosphor-icons/react'

export default function LoginForm() {
	const router = useRouter()
	const [isEmailVerified, setIsEmailVerified] = useState(false)

	const params = useSearchParams()
	const isNewUser = params.get('new_user')
	const userEmailForVerification = params.get('email')

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginInputType>({
		resolver: zodResolver(LoginInputSchema),
	})

	const { mutate: handleLoginUser, isPending: isLoggingInUser } = useMutation({
		mutationKey: loginUser.key,
		mutationFn: loginUser.fn,
		onSuccess: () => {
			toast.success("you're in!")
			router.replace('/dashboard')
		},
		onError: (e) => {
			toast.error(e?.message?.toLowerCase())
		},
	})

	const { mutate: handleVerifyUserEmail, isPending: isVerifyingOtp } = useMutation({
		mutationKey: verifyUserEmail.key,
		mutationFn: verifyUserEmail.fn,
		onSuccess: () => {
			toast.success('your email is verified!')
			setIsEmailVerified(true)
		},
		onError: (e) => {
			toast.error(e?.message?.toLowerCase())
		},
	})

	function onSubmit(formData: LoginInputType) {
		handleLoginUser(formData)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{isNewUser && !isEmailVerified && (
				<div className='flex flex-col items-center gap-2 mb-4'>
					<div className='bg-[cornflowerblue]/20 w-fit rounded-full px-2 py-1 flex items-center gap-2'>
						<Info weight='duotone' size={16} color='cornflowerblue' />
						<p className='text-zinc-500'>check your email for a one-time verification code</p>
					</div>

					<OtpInput onComplete={(d) => handleVerifyUserEmail({ email: userEmailForVerification!, otp: d })} />

					{isVerifyingOtp && (
						<div className='flex items-center gap-2'>
							<Spinner weight='duotone' size={16} className='animate-spin' />
							verifying...
						</div>
					)}
				</div>
			)}
			<div className='flex flex-col gap-2'>
				<Input
					type='email'
					required
					placeholder='your email'
					{...register('email')}
					isInvalid={!!errors?.email}
					error={errors?.email?.message}
				/>
				<Input
					type='password'
					required
					placeholder='your password'
					{...register('password')}
					isInvalid={!!errors?.password}
					error={errors?.password?.message}
				/>

				<div className='flex flex-col gap-4 items-center'>
					<Button type='submit' isLoading={isLoggingInUser}>
						log in
					</Button>
					<Link href='/auth/register'>
						<p className='underline'>create account instead</p>
					</Link>
				</div>
			</div>
		</form>
	)
}
