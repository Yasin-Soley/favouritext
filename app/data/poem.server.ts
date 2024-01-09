import { prisma } from './database.server'

import { CustomError } from '@/utils'
import type { PoemLine } from './validate.server'

export interface Poem {
	poet: string
	alias: string
	tags: string[]
	lines: PoemLine[]
}

export async function getAllPoems(userId: string) {
	const data = await prisma.poem.findMany({
		where: {
			userId,
		},
	})
	if (!data)
		throw new Error('دریافت لیست اشعار با خطا مواجه شد. دوباره تلاش کنید.')

	let listOfPoems = []
	for (const poem of data) {
		const { id, poetId, alias, tags } = poem

		const poet = await prisma.poet.findUnique({
			where: {
				id: poetId,
			},
		})

		if (!poet) throw new Error('عملیات با خطا مواجه شد. مجددا تلاش کنید.')

		const poemLines = await prisma.poemLine.findMany({
			where: {
				poemId: id,
			},
		})

		listOfPoems.push({
			id,
			poet: poet.name,
			alias,
			tags,
			lines: poemLines,
		})
	}

	return listOfPoems
}

export async function getPoemById(poemId: string) {
	const poem = await prisma.poem.findFirst({
		where: {
			id: poemId,
		},
	})
	if (!poem) throw new Error('دریافت شعر با خطا مواجه شد. دوباره تلاش کنید.')

	const { id, poetId, alias, tags } = poem

	const poet = await prisma.poet.findUnique({
		where: {
			id: poetId,
		},
	})

	if (!poet) throw new Error('عملیات با خطا مواجه شد. مجددا تلاش کنید.')

	const poemLines = await prisma.poemLine.findMany({
		where: {
			poemId: id,
		},
	})

	return {
		id,
		poet: poet.name,
		alias,
		tags,
		lines: poemLines,
	}
}

export async function addPoem(poem: Poem, userId: string) {
	const user = await prisma.user.findUnique({ where: { id: userId } })

	if (!user) {
		throw Error('برای افزودن شعر باید ابتدا وارد حساب کاربری خود شوید.')
	}

	const newPoem = await prisma.poem.create({
		data: {
			user: {
				connect: {
					id: user.id,
				},
			},
			alias: poem.alias,
			tags: poem.tags,
			poet: {
				connectOrCreate: {
					where: {
						name: poem.poet,
					},
					create: {
						name: poem.poet,
					},
				},
			},
			poemLines: {
				create: poem.lines,
			},
		},
	})

	if (!newPoem) {
		throw new CustomError('عملیات با خطا مواجه شد. دوباره تلاش کنید.', 401)
	}

	return newPoem
}

export async function deletePoem(poemId: string) {
	const poem = await prisma.poem.findUnique({
		where: { id: poemId },
	})

	if (!poem) {
		throw Error('شعر مورد نظر یافت نشد!')
	}

	const result = await prisma.$transaction([
		prisma.poemLine.deleteMany({
			where: {
				poemId: poemId,
			},
		}),

		prisma.poem.delete({
			where: {
				id: poemId,
			},
		}),
	])

	console.log(result)
	return result
}

export async function updatePoem(poemId: string, poem: Poem) {
	const existingPoem = await prisma.poem.findUnique({
		where: { id: poemId },
	})

	if (!existingPoem) {
		throw Error('شعر مورد نظر یافت نشد!')
	}

	const updatedPoem = await prisma.poem.update({
		where: {
			id: poemId,
		},
		data: {
			user: {
				connect: {
					id: existingPoem.userId,
				},
			},
			alias: poem.alias,
			tags: poem.tags,
			poet: {
				connectOrCreate: {
					where: {
						name: poem.poet,
					},
					create: {
						name: poem.poet,
					},
				},
			},
			poemLines: {
				// This will delete all existing poemLines and create new ones
				deleteMany: {},
				create: poem.lines,
			},
		},
	})

	if (!updatedPoem) {
		throw new CustomError('عملیات با خطا مواجه شد. دوباره تلاش کنید.', 401)
	}

	return updatedPoem
}
