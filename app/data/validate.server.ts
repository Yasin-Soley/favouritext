import type { Credentials } from '~/utils'

function isValidEmail(value: string) {
	return value && value.includes('@') && value.includes('.com')
}

function isValidPassword(value: string) {
	return value && value.trim().length >= 5 && value.trim().length <= 10
}

function isValidRepeatedPassword(value: string, password: string) {
	return value && value === password
}

export interface ValidationError {
	email?: string
	password?: string
	repeatedPassword?: string
	username?: string
}

export function validateCredentials(input: Credentials) {
	let validationErrors: ValidationError = {}

	if (typeof input.email === 'string' && !isValidEmail(input.email)) {
		validationErrors.email = 'آدرس ایمیل نامعتبر است.'
	}

	if (
		typeof input.password === 'string' &&
		!isValidPassword(input.password)
	) {
		validationErrors.password =
			'رمز عبور نامعتبر است. باید بین 5 تا 10 کاراکتر باشد. '
	}

	if (
		typeof input.repeatedPassword === 'string' &&
		!isValidRepeatedPassword(input.repeatedPassword, input.password)
	) {
		validationErrors.repeatedPassword =
			'رمز عبور با تکرار رمز عبور تطابق ندارد.'
	}

	console.log(validationErrors)

	if (Object.keys(validationErrors).length > 0) {
		throw validationErrors
	} else
		return {
			email: input.email,
			password: input.password,
			username: input.username,
		}
}

interface Poem {
	poet: string
	alias: string
	tags: string[]
	lines: { p1: string; p2: string }[]
}

type PoemError = {
	poet?: string
	alias?: string
	lines?: { message: string; line: number }
	tags?: string
}

function isValidPoet(value: string) {
	return value && value.trim().length >= 0 && value.trim().length <= 22
}
function isValidAlias(value: string) {
	return value && value.trim().length >= 0 && value.trim().length <= 12
}
function isValidLines(value: { p1: string; p2: string }[]) {
	return value.findIndex(
		(line) => line.p1.trim().length === 0 || line.p2.trim().length === 0
	)
}

export function validatePoemData({ poet, tags, lines, alias }: Poem) {
	let poemDataErrors: PoemError = {}

	if (typeof poet === 'string' && !isValidPoet(poet)) {
		poemDataErrors.poet = 'نام شاعر را مجددا بررسی کنید!'
	}

	if (typeof alias === 'string' && !isValidAlias(alias)) {
		poemDataErrors.alias = 'نام انتخابی شعر را مجددا بررسی کنید!'
	}

	const lineValidation = isValidLines(lines)
	if (lineValidation !== -1) {
		poemDataErrors.lines = {
			line: lineValidation,
			message: 'این بیت را بررسی کنید!',
		}
	}

	if (Object.keys(poemDataErrors).length > 0) throw poemDataErrors
}
