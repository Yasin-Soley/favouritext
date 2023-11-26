import { json, type ActionFunctionArgs } from '@remix-run/node'
import { destroyUserSession } from '~/data/auth.server'

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method !== 'DELETE') {
		throw json({ message: 'invalid request method.' }, { status: 400 })
	}

	return destroyUserSession(request)
}
