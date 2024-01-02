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
					? 'block px-4 py-3 transition bg-main  text-green_dark animate-pulse rounded-t-sm'
					: isActive
					? 'block px-4 py-3 transition bg-main  text-green_dark rounded-t-sm'
					: 'block px-4 py-3 transition hover:bg-main  hover:text-green_dark rounded-t-sm'
			}
			to={to}
		>
			{children}
		</NavLink>
	)
}
