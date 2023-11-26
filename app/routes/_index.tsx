import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import MainNavigation from '~/components/MainNavigation'
import { getUserFromSession } from '~/data/auth.server'

export const meta: MetaFunction = () => {
	return [
		{ title: 'New Remix App' },
		{ name: 'description', content: 'Welcome to Remix!' },
	]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	return getUserFromSession(request)
}

export default function Index() {
	const userId: string | null = useLoaderData()

	return (
		<div>
			<MainNavigation />
			<h1>hello {userId || 'friend'}!</h1>
		</div>
	)
}
