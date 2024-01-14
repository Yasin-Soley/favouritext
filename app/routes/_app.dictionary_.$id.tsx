import WordForm from '@/components/pages/dictionary/WordForm'
import { requireUserSession } from '@/data/auth.server'
import { validateWordData, type WordError } from '@/data/validate.server'
import { getWordById, updateWord } from '@/data/word.server'
import {
	json,
	redirect,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	await requireUserSession(request)

	const wordId = params.id!
	const word = await getWordById(wordId)

	return word
}

export default function EditWordPage() {
	const wordData = useLoaderData<typeof loader>()

	return (
		<main className="my-10 flex flex-col items-center gap-y-8">
			<h2 className="text-xl font-bold">ویرایش واژه</h2>

			<WordForm wordData={wordData} />
		</main>
	)
}

// TODO: add action
export const action = async ({ request, params }: ActionFunctionArgs) => {
	const wordId = params.id

	if (request.method !== 'PUT')
		throw json({ message: 'نوع درخواست معتبر نیست.' }, { status: 400 })

	if (!wordId)
		throw json({ message: 'واژۀ مورد نظر یافت نشد. مجددا تلاش کنید.' })

	const formData = await request.formData()
	const word = formData.get('word') as string
	const meanings = formData.get('meanings') as string
	const definitions = formData.get('definitions') as string
	const examples = formData.get('examples') as string
	const appearances = formData.get('appearances') as string

	try {
		// TODO: validate input values
		const verifiedData = validateWordData({
			word,
			meanings,
			examples,
			definitions,
			appearances,
		})

		// TODO: modify word in database
		const modifiedWord = await updateWord(verifiedData, wordId)
		console.log(modifiedWord)

		return redirect('/dictionary')
	} catch (error: any) {
		// if (isCustomError(error)) {
		// 	return { credentials: error.message }
		// }
		return error as WordError
	}
}
