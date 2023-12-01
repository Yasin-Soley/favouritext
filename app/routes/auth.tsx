import { redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { useSearchParams } from '@remix-run/react'

import { getUserFromSession, login, signup } from '~/data/auth.server'
import { isCustomError, type Credentials } from '~/utils'
import Auth from '~/components/Auth'
import {
	validateCredentials,
	type ValidationError,
} from '~/data/validate.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const userId = await getUserFromSession(request)

	// return userId ? redirect('/') : null
	// todo: shortcut of above will be:
	return userId && redirect('/')
	// ? with &&:
	// ? if all statements are true, it will return last one
	// ? otherwise, it returns the first falsy value it reaches
}

export default function LoginPage() {
	const [searchParams] = useSearchParams()
	const authMode = searchParams.get('mode') || 'login'

	return (
		<>
			<Auth mode={authMode} />
		</>
	)
}

export const action = async ({ request }: LoaderFunctionArgs) => {
	const searchParams = new URL(request.url).searchParams
	const authMode = searchParams.get('mode') || 'login'

	const formData = await request.formData()
	const email = formData.get('email') as string
	const password = formData.get('password') as string
	const credentials: Credentials = {
		email,
		password,
	}
	if (authMode === 'signup') {
		credentials.repeatedPassword = formData.get(
			'repeated-password'
		) as string
		credentials.username = formData.get('username') as string
	}

	try {
		validateCredentials(credentials)

		if (authMode === 'login') {
			return await login(credentials)
		} else {
			return await signup(credentials)
		}
	} catch (error: any) {
		if (isCustomError(error)) {
			return { credentials: error.message }
		}
		return error as ValidationError
	}
}
