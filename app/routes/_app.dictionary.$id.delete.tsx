import {
	json,
	redirect,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { getUserFromSession, getUsernameById } from '@/data/auth.server'
import { deleteWord, getWordById } from '@/data/word.server'
import DeleteWordModal from '@/components/pages/dictionary/DeleteWordModal'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const userId = await getUserFromSession(request)
	const username = await getUsernameById(userId!)
	const word = await getWordById(params.id!)
	return { username, word }
}

export default function DeleteWordPage() {
	const { username, word } = useLoaderData<typeof loader>()

	return (
		<DeleteWordModal
			username={username}
			word={word.word}
			wordId={word.id}
		/>
	)
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
	if (request.method !== 'DELETE') {
		throw json({ message: 'نوع درخواست معتبر نیست.' }, { status: 400 })
	}

	if (!params.id)
		throw json({ message: 'واژۀ مورد نظر یافت نشد. مجددا تلاش کنید.' })

	try {
		await deleteWord(params.id)
	} catch (error) {
		return error
	}

	return redirect('/dictionary')
}
