import type { ReactNode } from 'react'
import { Link } from '@remix-run/react'

interface ButtonProps {
	children: ReactNode
	type?: 'submit' | 'button'
	isButton?: boolean
	isLoading?: boolean
	to?: string
	className?: string
}

export default function Button({
	to,
	children,
	className,
	isButton,
	isLoading,
	type,
}: ButtonProps) {
	className =
		'w-24 py-2 text-sm inline-block text-center rounded-sm disabled:cursor-not-allowed disabled:bg-opacity-60 ' +
		className

	if (isButton)
		return (
			<button disabled={isLoading} type={type} className={className}>
				{children}
			</button>
		)

	return (
		<button disabled={isLoading}>
			<Link className={className} to={to!}>
				{children}
			</Link>
		</button>
	)
}
