import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	redirect,
} from '@remix-run/node'
import { useLoaderData, useMatches } from '@remix-run/react'

import DeletePoemModal from '@/components/pages/poem/DeletePoemModal'
import { deletePoem } from '@/data/poem.server'

interface ParentRouteData {
	username: string
	poems: {
		id: string
		poet: string
		alias: string
		tags: string[]
		lines: {
			id: string
			p1: string
			p2: string
			poemId: string
		}[]
	}[]
	tagsFilter: string[]
	poetsFilter: string[]
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
	return params.id
}

export default function DeletePoemPage() {
	const poemId = useLoaderData<typeof loader>()

	const matches = useMatches()
	const route = matches.find((match) => match.id === 'routes/_app.poem')!
	const data = route.data as ParentRouteData
	const { username } = data
	const { alias } = data.poems.find((poem) => poem.id === poemId)!

	return <DeletePoemModal alias={alias} username={username} poemId={poemId} />
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
	if (request.method !== 'DELETE') {
		throw json({ message: 'نوع درخواست معتبر نیست.' }, { status: 400 })
	}

	if (!params.id)
		throw json({ message: 'شعر مورد نظر یافت نشد. مجددا تلاش کنید.' })

	try {
		await deletePoem(params.id)
	} catch (error) {
		return error
	}

	return redirect('/poem')
}
