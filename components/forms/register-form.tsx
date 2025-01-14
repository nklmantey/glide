import { Button, Input } from '../ui'
import Link from 'next/link'

export default function RegisterForm() {
	return (
		<div className='flex flex-col gap-2'>
			<Input required placeholder='your name' />
			<Input type='email' required placeholder='your email' />
			<Input type='password' required placeholder='your password' />

			<div className='flex flex-col gap-4 items-center'>
				<Button>create account</Button>
				<Link href='/auth/login'>
					<p className='underline'>log in instead</p>
				</Link>
			</div>
		</div>
	)
}
