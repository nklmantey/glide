import { ReactNode, ButtonHTMLAttributes } from 'react'

type ButtonProps = {
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className='bg-gray-100 px-4 py-2 hover:bg-gray-200 hover:border-gray-400 rounded-xl transition-all duration-300 text-gray-400 text-sm hover:text-[#212427] tracking-tight'
    >
      {children}
    </button>
  )
}
