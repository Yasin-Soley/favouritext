import { type LinksFunction } from '@remix-run/node'
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

import stylesheet from '~/styles/style.css'

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: stylesheet },
]

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
			<body className="bg-slate-100">
				<Outlet />
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
			<body>
				<h1>
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
