import { Button, Input } from '@/components/ui'
import { OtpInput } from '@/components/global'
import { LoginInputSchema, LoginInputType } from '@/schemas'
import { loginUser, verifyUserEmail } from '@/api'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useState } from 'react'
import { SpinnerIcon } from '@phosphor-icons/react'
import { InformationCircleIcon } from '@heroicons/react/16/solid'
import { Link, useNavigate, useSearchParams } from 'react-router'

export default function LoginForm() {
	const [isEmailVerified, setIsEmailVerified] = useState(false)
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const isNewUser = searchParams.get('new_user')
	const userEmailForVerification = searchParams.get('email')

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
			navigate('/dashboard')
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
					<div className='bg-[cornflowerblue]/20 dark:bg-[cornflowerblue]/10 w-fit rounded-full px-2 py-1 flex items-center gap-2'>
						<InformationCircleIcon className='size-4 text-[cornflowerblue]' />
						<p className='text-zinc-500 dark:text-zinc-400'>check your email for a one-time verification code</p>
					</div>

					<OtpInput onComplete={(d) => handleVerifyUserEmail({ email: userEmailForVerification!, otp: d })} />

					{isVerifyingOtp && (
						<div className='flex items-center gap-2 text-zinc-500 dark:text-zinc-400'>
							<SpinnerIcon weight='duotone' size={16} className='animate-spin' />
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
					isPassword
					isInvalid={!!errors?.password}
					error={errors?.password?.message}
				/>

				<div className='flex flex-col gap-4 items-center'>
					<Button type='submit' isLoading={isLoggingInUser}>
						log in
					</Button>
					<Link to='/auth/register'>
						<p className='underline text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors'>
							create account instead
						</p>
					</Link>
				</div>
			</div>
		</form>
	)
}
