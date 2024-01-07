import type { Credentials } from '@/utils'

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

export interface Poem {
	poet: string
	alias: string
	tags: string
	lines: string
}

export type PoemError = {
	poet?: string
	alias?: string
	lines?: { lineNumber: number; part: string }
	tags?: string
}

function isValidPoet(value: string) {
	return value && value.trim().length >= 0 && value.trim().length <= 22
}
function isValidAlias(value: string) {
	return value && value.trim().length >= 0 && value.trim().length <= 20
}

function isValidTags(value: string[]) {
	return value[0] && value.length <= 5
}

export type PoemLine = { p1: string; p2: string }

function isNotValidLines(value: PoemLine[]) {
	let index
	for (const lineNumber in value) {
		if (!value[+lineNumber].p1.trim()) {
			index = { lineNumber: +lineNumber, part: 'p1' }
			break
		}
		if (!value[+lineNumber].p2.trim()) {
			index = { lineNumber: +lineNumber, part: 'p2' }
			break
		}
	}

	return index
}

export function validatePoemData({ poet, tags, lines, alias }: Poem) {
	let poemDataErrors: PoemError = {}

	if (typeof poet === 'string' && !isValidPoet(poet)) {
		poemDataErrors.poet = 'نام شاعر را مجددا بررسی کنید!'
	}

	if (typeof alias === 'string' && !isValidAlias(alias)) {
		poemDataErrors.alias = 'نام انتخابی شعر را مجددا بررسی کنید!'
	}

	let modifiedTags = tags.split(',')
	if (typeof tags === 'string' && !isValidTags(modifiedTags)) {
		poemDataErrors.tags =
			'برچسب ها را مجددا بررسی کنید. حداقل 1 و حداکثر 5 برچسب اضافه کنید!'
	}

	let splitLines = lines.split('/')
	let splitMonostich = splitLines.map((line) => {
		let obj = {} as PoemLine
		obj.p1 = line.split(',')[0]
		obj.p2 = line.split(',')[1]
		return obj
	})
	if (isNotValidLines(splitMonostich)) {
		poemDataErrors.lines = isNotValidLines(splitMonostich)
	}

	const verifiedData = {
		poet,
		alias,
		tags: modifiedTags,
		lines: splitMonostich,
	}

	if (Object.keys(poemDataErrors).length > 0) throw poemDataErrors
	else return verifiedData
}
