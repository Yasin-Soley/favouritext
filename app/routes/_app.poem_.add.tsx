import {
	redirect,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	type MetaFunction,
} from '@remix-run/node'

import { validatePoemData, type PoemError } from '@/data/validate.server'
import { getUserFromSession, requireUserSession } from '@/data/auth.server'

import PoemForm from '@/components/pages/poem/PoemForm'
import { addPoem } from '@/data/poem.server'

export const meta: MetaFunction = () => {
	return [
		{ title: 'LOGO - Adding poem' },
		{
			name: 'description',
			content:
				'This is where I store the words that are new, interesting or valuable to me.',
		},
	]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	return await requireUserSession(request)
}

export default function AddPoemPage() {
	return (
		<main className="my-10 flex flex-col items-center gap-y-8">
			<h2 className="text-xl font-bold">افزودن شعر</h2>

			<PoemForm />
		</main>
	)
}

export const action = async ({ request }: ActionFunctionArgs) => {
	// TODO: get input values
	const formData = await request.formData()
	const poet = formData.get('poet') as string
	const alias = formData.get('alias') as string
	const tags = formData.get('tags') as string
	const lines = formData.get('lines') as string

	try {
		// TODO: validate input values
		const verifiedData = validatePoemData({ poet, alias, tags, lines })

		// TODO: add poem to database
		const userId = await getUserFromSession(request)
		let addedPoem
		if (userId) addedPoem = await addPoem(verifiedData, userId)
		console.log(addedPoem)

		return redirect('/poem')
	} catch (error: any) {
		// if (isCustomError(error)) {
		// 	return { credentials: error.message }
		// }
		return error as PoemError
	}
}
