import { Button, Input } from '../ui'
import Link from 'next/link'

export default function LoginForm() {
	return (
		<div className='flex flex-col gap-2'>
			<Input type='email' required placeholder='your email' />
			<Input type='password' required placeholder='your password' />

			<div className='flex flex-col gap-4 items-center'>
				<Button>log in</Button>
				<Link href='/auth/register'>
					<p className='underline'>create account instead</p>
				</Link>
			</div>
		</div>
	)
}
