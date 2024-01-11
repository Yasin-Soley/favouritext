import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	type MetaFunction,
} from '@remix-run/node'

import { requireUserSession } from '@/data/auth.server'
import WordForm from '@/components/pages/dictionary/WordForm'

export const meta: MetaFunction = () => {
	return [
		{ title: 'LOGO - Adding Word to Dictionary' },
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

export default function AddWordPage() {
	return (
		<main className="my-10 flex flex-col items-center gap-y-8">
			<h2 className="text-xl font-bold">افزودن واژه</h2>

			<WordForm />
		</main>
	)
}

export const action = async ({ request }: ActionFunctionArgs) => {
	// TODO: get input values
	const formData = await request.formData()
	const word = formData.get('word') as string
	const meanings = formData.get('meanings') as string
	const examples = formData.get('examples') as string
	const appearances = formData.get('appearances') as string

	console.log({
		word,
		meanings,
		examples,
		appearances,
	})

	// TODO: validation
	// TODO: submitting

	return null
}
