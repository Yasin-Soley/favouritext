import { Link } from '@remix-run/react'
import type { ReactNode } from 'react'

interface ButtonProps {
	type: 'button' | 'link'
	to?: string
	children: ReactNode
	className?: string
}

export default function Button({ to, children, className, type }: ButtonProps) {
	className +=
		' w-20 py-2 text-sm bg-primary inline-block text-center rounded-sm '

	if (type === 'button')
		return <button className={className}>{children}</button>
	else
		return (
			<Link
				className={
					'w-20 py-2 text-sm bg-primary inline-block text-center rounded-sm  ' +
					className
				}
				to={to!}
			>
				{children}
			</Link>
		)
}
