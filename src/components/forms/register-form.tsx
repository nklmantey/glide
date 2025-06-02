import { RegisterInputSchema, RegisterInputType } from '@/schemas'
import { Button, Input } from '@/components/ui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { registerUser } from '@/api'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router'

export default function RegisterForm() {
	const navigate = useNavigate()

	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
	} = useForm<RegisterInputType>({
		resolver: zodResolver(RegisterInputSchema),
	})

	const values = getValues()

	const { mutate: handleRegisterUser, isPending: isRegisteringUser } = useMutation({
		mutationKey: registerUser.key,
		mutationFn: registerUser.fn,
		onSuccess: (d) => {
			toast.success('all good!')
			if (d.status === 'success') navigate(`/auth/login?new_user=true&email=${values.email}`)
		},
		onError: (e) => {
			toast.error(e?.message)
		},
	})

	async function onSubmit(formData: RegisterInputType) {
		handleRegisterUser(formData)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className='flex flex-col gap-2'>
				<Input
					type='text'
					required
					placeholder='your name'
					{...register('name')}
					isInvalid={!!errors?.name}
					error={errors?.name?.message}
				/>
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
					isPassword
					{...register('password')}
					isInvalid={!!errors?.password}
					error={errors?.password?.message}
				/>

				<div className='flex flex-col gap-4 items-center'>
					<Button type='submit' isLoading={isRegisteringUser}>
						create account
					</Button>
					<Link to='/auth/login'>
						<p className='underline text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors'>
							log in instead
						</p>
					</Link>
				</div>
			</div>
		</form>
	)
}
