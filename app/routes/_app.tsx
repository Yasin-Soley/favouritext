import { Outlet } from '@remix-run/react'
import MainNavigation from '~/components/navigation/MainNavigation'

export default function NotingLayout() {
	return (
		<>
			<header className="bg-secondary h-1/6">
				<MainNavigation />
			</header>
			<Outlet />
		</>
	)
}
