import { prisma } from './database.server'
import { CustomError } from '@/utils'

export interface Word {
	word: string
	meanings: string[]
	definitions: string[]
	examples: string[]
	appearances: string[]
}

export async function getAllWords(userId: string) {
	const wordsList = await prisma.word.findMany({
		where: {
			userId,
		},
	})

	if (!wordsList)
		throw new Error('دریافت لیست واژگان با خطا مواجه شد. دوباره تلاش کنید.')

	return wordsList
}

export async function addWord(word: Word, userId: string) {
	const user = await prisma.user.findUnique({ where: { id: userId } })

	if (!user) {
		throw Error('برای افزودن شعر باید ابتدا وارد حساب کاربری خود شوید.')
	}

	const newWord = await prisma.word.create({
		data: {
			user: {
				connect: {
					id: user.id,
				},
			},
			word: word.word,
			meanings: word.meanings,
			definitions: word.definitions,
			examples: word.examples,
			appearance: word.appearances,
		},
	})

	if (!newWord) {
		throw new CustomError('عملیات با خطا مواجه شد. دوباره تلاش کنید.', 401)
	}

	return newWord
}
