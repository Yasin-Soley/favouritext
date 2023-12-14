import { CustomError } from '~/utils'
import { prisma } from './database.server'

export async function getUsernameById(userId: string) {
	const user = await prisma.user.findFirst({ where: { id: userId } })

	if (!user) {
		throw new CustomError('کاربر با ایمیل وارد شده یافت نشد!!', 404)
	}

	return user.username
}
