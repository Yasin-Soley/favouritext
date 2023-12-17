import { NavLink } from '@remix-run/react'
import type { ReactNode } from 'react'

interface NavigateLinkProps {
	to: string
	children: ReactNode
}

export default function NavigateLink({ to, children }: NavigateLinkProps) {
	return (
		<NavLink
			className={({ isActive, isPending }) =>
				isPending
					? 'block px-4 py-3 transition bg-main  text-green_dark animate-pulse'
					: isActive
					? 'block px-4 py-3 transition bg-main  text-green_dark'
					: 'block px-4 py-3 transition hover:bg-main  hover:text-green_dark'
			}
			to={to}
		>
			{children}
		</NavLink>
	)
}
