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
