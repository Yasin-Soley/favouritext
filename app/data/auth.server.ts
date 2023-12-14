import { createCookieSessionStorage, redirect } from '@remix-run/node'
import pkg from 'bcryptjs'

import { prisma } from './database.server'
import { CustomError, type Credentials } from '~/utils'

const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: '__session',
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secrets: [process.env.SESSION_SECRET!],
		secure: process.env.NODE_ENV === 'production',
	},
})

const USER_SESSION_KEY = 'userId'

export async function createUserSession(userId: string, redirectPath: string) {
	const session = await sessionStorage.getSession()
	session.set(USER_SESSION_KEY, userId)

	return redirect(redirectPath, {
		headers: {
			'Set-Cookie': await sessionStorage.commitSession(session, {
				maxAge: 60 * 60 * 24 * 7, // 7 days
			}),
		},
	})
}

// ? this function acts an an guard; for pages that need user to be authenticated.
export async function destroyUserSession(request: Request) {
	const session = await sessionStorage.getSession(
		request.headers.get('Cookie')
	)

	return redirect('/', {
		headers: {
			'Set-Cookie': await sessionStorage.destroySession(session),
		},
	})
}

// ? but this one is just for getting user that we assume already is authenticated.
// ? because user is in pages that supposed to be protected.
// ? so has to be signed in, and therefor, there will be a userId.
// ? ```if (!userId) return null```  is just a step added for sake of completeness.

export async function requireUserSession(request: Request) {
	const userId = await getUserFromSession(request)

	if (!userId) {
		throw redirect('/auth?mode=login')
	}

	return userId
}

export async function getUserFromSession(
	request: Request
): Promise<string | null> {
	const session = await sessionStorage.getSession(
		request.headers.get('Cookie')
	)

	const userId = session.get('userId')

	if (!userId) {
		return null
	}

	console.log('passed')

	return userId
}

export async function signup({ email, password, username }: Credentials) {
	const existingUser = await prisma.user.findFirst({
		where: {
			email,
		},
	})

	if (existingUser) {
		throw new CustomError('کاربر با ایمیل وارد شده از قبل وجود دارد!', 422)
	}

	const { hash } = pkg

	const passwordHash = await hash(password, 12)

	const user = await prisma.user.create({
		data: {
			email,
			password: passwordHash,
			username: username!,
		},
	})

	return createUserSession(user.id, '/dictionary')
}

export async function login({ email, password }: Credentials) {
	const existingUser = await prisma.user.findFirst({
		where: {
			email,
		},
	})

	if (!existingUser) {
		throw new CustomError('ایمیل یا رمز عبور نادرست است.', 401)
	}

	const { compare } = pkg

	const isPasswordCorrect = await compare(password, existingUser.password)

	if (!isPasswordCorrect) {
		throw new CustomError('ایمیل یا رمز عبور نادرست است.', 401)
	}

	return createUserSession(existingUser.id, '/dictionary')
}
