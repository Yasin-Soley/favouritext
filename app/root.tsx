import { type LinksFunction, type LoaderFunctionArgs } from '@remix-run/node'
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useRouteError,
} from '@remix-run/react'

import stylesheet from '@/styles/style.css'

import { getUserFromSession } from './data/auth.server'
import MainNavigation from './components/layout/MainNavigation'

import Footer from './components/layout/Footer'

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: stylesheet },
]

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const userId = await getUserFromSession(request)
	console.log('root.tsx: ', userId)
	return userId
}

export default function App() {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<Meta />
				<Links />
			</head>
			<body
				dir="rtl"
				className="bg-main text-green_dark"
				style={{ fontFamily: 'dirooz' }}
			>
				<Outlet />

				<Footer />

				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}

export function ErrorBoundary() {
	const error = useRouteError()
	console.error(error)

	return (
		<html>
			<head>
				<title>Oh no!</title>
				<Meta />
				<Links />
			</head>
			<body
				dir="rtl"
				className="bg-main text-green_dark"
				style={{ fontFamily: 'dirooz' }}
			>
				<header className="bg-secondary">
					<MainNavigation />
				</header>

				<h1 className="text-center text-xl text-opacity-70 mt-16">
					{isRouteErrorResponse(error)
						? error.data
						: error instanceof Error
						? error.message
						: 'something went wrong'}
				</h1>
				<Scripts />
			</body>
		</html>
	)
}
