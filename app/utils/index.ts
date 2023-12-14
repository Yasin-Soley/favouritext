export const isCustomError = (obj: CustomError): obj is CustomError => {
	if (obj.statusCode) return true
	else return false
}

export interface CustomError {
	message: string
	statusCode: number
}

export class CustomError extends Error {
	constructor(public message: string, public statusCode: number) {
		super(message)
	}
}

export interface Credentials {
	email: string
	password: string
	username?: string
	repeatedPassword?: string
}

export const alphabets = (function () {
	let alphabets: string[] = []

	for (let i = 97; i <= 122; i++) {
		alphabets.push(String.fromCharCode(i))
	}

	return alphabets
})()
