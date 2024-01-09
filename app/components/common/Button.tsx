import type { ReactNode } from 'react'
import { Link } from '@remix-run/react'

interface ButtonProps {
	children: ReactNode
	type?: 'submit' | 'button'
	isButton?: boolean
	isLoading?: boolean
	to?: string
	className?: string
	preventScrollReset?: boolean
	onClick?: () => void
}

export default function Button({
	to,
	children,
	className,
	isButton,
	isLoading,
	type,
	preventScrollReset,
	onClick,
}: ButtonProps) {
	className =
		'disabled:cursor-not-allowed disabled:bg-opacity-60 text-sm text-center rounded-sm ' +
		className

	if (isButton)
		return (
			<button
				disabled={isLoading}
				type={type}
				className={className}
				onClick={onClick}
			>
				{children}
			</button>
		)

	return (
		<button disabled={isLoading}>
			<Link
				className={className}
				to={to!}
				preventScrollReset={preventScrollReset}
			>
				{children}
			</Link>
		</button>
	)
}
