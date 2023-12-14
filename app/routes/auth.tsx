import { redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { useSearchParams } from '@remix-run/react'

import { getUserFromSession, login, signup } from '~/data/auth.server'
import { isCustomError } from '~/utils'
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
	// ? it will return the first falsy value it reaches
	// ? otherwise(all statements are true), it returns the last one
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

	let credentials
	if (authMode === 'login') {
		credentials = {
			email,
			password,
		}
	} else {
		const repeatedPassword = formData.get('repeated-password') as string
		const username = formData.get('username') as string

		credentials = { email, password, repeatedPassword, username }
	}

	try {
		const signupCredentials = validateCredentials(credentials)

		if (authMode === 'login') {
			return await login(credentials)
		} else {
			return await signup(signupCredentials)
		}
	} catch (error: any) {
		if (isCustomError(error)) {
			return { credentials: error.message }
		}
		return error as ValidationError
	}
}
