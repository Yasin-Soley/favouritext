import { Outlet } from '@remix-run/react'
import MainNavigation from '~/components/layout/MainNavigation'

export default function NotingLayout() {
	return (
		<>
			<header className="bg-green_dark h-1/6">
				<MainNavigation />
			</header>
			<Outlet />
		</>
	)
}
