import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getUserFromSession } from '~/data/auth.server'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Write For Life' },
		{ name: 'description', content: 'Welcome to Remix!' },
	]
}

export const loader = async ({
	request,
}: LoaderFunctionArgs): Promise<String | null> => {
	return getUserFromSession(request)
}

export default function Index() {
	const userId = useLoaderData<typeof loader>()

	return (
		<div>
			<h1>hello {userId || 'friend'}!</h1>
		</div>
	)
}
