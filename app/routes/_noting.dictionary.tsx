import type { LoaderFunctionArgs } from '@remix-run/node'
import { requireUserSession } from '~/data/auth.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	await requireUserSession(request)

	return null
}

export default function Dictionary() {
	return (
		<div>
			<p>Dictionary</p>
		</div>
	)
}
