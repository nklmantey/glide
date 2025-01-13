import { ReactNode, InputHTMLAttributes } from 'react'

type InputProps = {
  placeholder?: string
} & InputHTMLAttributes<HTMLInputElement>

export default function Input({ placeholder, ...props }: InputProps) {
  return (
    <input
      {...props}
      className='bg-gray-100 px-4 py-2 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 rounded-xl transition-all duration-300 text-sm tracking-tight min-w-[300px]'
      placeholder={placeholder}
    />
  )
}
