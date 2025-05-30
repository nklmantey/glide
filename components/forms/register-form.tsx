import { RegisterInputSchema, RegisterInputType } from '@/schemas'
import { Button, Input } from '../ui'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { registerUser } from '@/api'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function RegisterForm() {
	const router = useRouter()

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
			if (d.status === 'success') router.push(`/auth/login?new_user=true&email=${values.email}`)
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
					<Link href='/auth/login'>
						<p className='underline'>log in instead</p>
					</Link>
				</div>
			</div>
		</form>
	)
}
