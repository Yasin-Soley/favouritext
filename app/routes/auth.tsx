import { type LoaderFunctionArgs } from '@remix-run/node'
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react'

import { login, signup } from '~/data/auth.server'
import { isCustomError } from '~/utils'

export default function LoginPage() {
	const validationErrors = useActionData<typeof action>()

	const [searchParams] = useSearchParams()
	const authMode = searchParams.get('mode') || 'login'

	const btnText = authMode === 'login' ? 'Log In' : 'Sign Up'
	const linkText =
		authMode === 'login' ? 'create new account' : 'have account'
	const linkHref = authMode === 'login' ? 'signup' : 'login'

	return (
		<>
			<Form method="post">
				<label htmlFor="email">Email address</label>
				<input
					className="bg-red-100"
					id="email"
					required
					name="email"
					type="email"
					autoComplete="email"
				/>

				<label htmlFor="password">Password</label>
				<input
					className="bg-red-100"
					id="password"
					name="password"
					type="password"
					autoComplete="current-password"
				/>

				<button type="submit">{btnText}</button>
				<Link className="block" to={`?mode=${linkHref}`}>
					{linkText}
				</Link>
				{validationErrors && (
					<ul>
						{Object.values(validationErrors).map((error) => (
							<li key={error}>{error}</li>
						))}
					</ul>
				)}
			</Form>
		</>
	)
}

export const action = async ({ request }: LoaderFunctionArgs) => {
	const searchParams = new URL(request.url).searchParams
	const authMode = searchParams.get('mode') || 'login'

	const formData = await request.formData()
	const email = formData.get('email') as string
	const password = formData.get('password') as string
	const credentials = {
		email,
		password,
	}

	// Perform form validation
	// const user = await verifyLogin(email, password)

	try {
		if (authMode === 'login') {
			return await login(credentials)
		} else {
			return await signup(credentials)
		}
	} catch (error: any) {
		if (isCustomError(error)) {
			return { credentials: error.message }
		}
	}
}
