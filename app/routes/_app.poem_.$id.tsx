import PoemForm from '@/components/pages/poem/PoemForm'
import { requireUserSession } from '@/data/auth.server'
import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	redirect,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getPoemById, updatePoem } from '@/data/poem.server'
import { validatePoemData, type PoemError } from '@/data/validate.server'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	await requireUserSession(request)

	const poemId = params.id!
	const poem = await getPoemById(poemId)

	return poem
}

export default function EditPoemPage() {
	const poemData = useLoaderData<typeof loader>()
	console.log(poemData.lines)

	return (
		<main className="my-10 flex flex-col items-center gap-y-8">
			<h2 className="text-xl font-bold">ویرایش شعر</h2>

			<PoemForm poem={poemData} />
		</main>
	)
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const poemId = params.id!

	if (request.method !== 'PUT')
		throw json({ message: 'نوع درخواست معتبر نیست.' }, { status: 400 })

	if (!params.id)
		throw json({ message: 'شعر مورد نظر یافت نشد. مجددا تلاش کنید.' })

	const formData = await request.formData()
	const poet = formData.get('poet') as string
	const alias = formData.get('alias') as string
	const tags = formData.get('tags') as string
	const lines = formData.get('lines') as string

	try {
		const verifiedData = validatePoemData({ poet, alias, tags, lines })

		await updatePoem(poemId, verifiedData)

		return redirect('/poem')
	} catch (error: any) {
		// if (isCustomError(error)) {
		// 	return { credentials: error.message }
		// }
		return error as PoemError
	}
}
