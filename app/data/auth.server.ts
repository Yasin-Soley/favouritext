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

	return userId
}

export async function signup({ email, password }: Credentials) {
	const existingUser = await prisma.user.findFirst({
		where: {
			email,
		},
	})

	if (existingUser) {
		throw new CustomError('user already exists with provided email!', 422)
	}

	const { hash } = pkg

	const passwordHash = await hash(password, 12)

	const user = await prisma.user.create({
		data: {
			email,
			password: passwordHash,
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
	console.log(existingUser)

	if (!existingUser) {
		throw new CustomError(
			'could not log you in. please check provided credentials!',
			401
		)
	}

	const { compare } = pkg

	const isPasswordCorrect = await compare(password, existingUser.password)

	if (!isPasswordCorrect) {
		throw new CustomError(
			'could not log you in. please check provided credentials!',
			401
		)
	}

	return createUserSession(existingUser.id, '/dictionary')
}

// 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
