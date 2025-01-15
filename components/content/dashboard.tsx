import React from 'react'
import { Card } from '../ui/card'

export default function Dashboard() {
	return (
		<div className='w-full h-full grid grid-cols-3 max-w-4xl gap-1'>
			<div className='col-span-2 row-span-2 lg:row-span-2 border border-zinc-200 p-4 bg-white'>A</div>
			<div className='col-span-1 row-span-3 border border-zinc-200 p-4 bg-white'>B</div>
			<div className='col-span-2 row-span-1 border border-zinc-200 p-4 bg-white'>C</div>
		</div>
	)
}
