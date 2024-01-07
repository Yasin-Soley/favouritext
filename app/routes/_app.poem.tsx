import { Form, useLoaderData } from '@remix-run/react'

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import PoemBox from '@/components/pages/poem/PoemBox'
import Sidebar from '@/components/pages/poem/Sidebar'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { getUsernameById, requireUserSession } from '@/data/auth.server'
import { getAllPoems } from '@/data/poem.server'

export const meta: MetaFunction = () => {
	return [
		{ title: 'LOGO - Poem' },
		{
			name: 'description',
			content:
				'This is where I store the words that are new, interesting or valuable to me.',
		},
	]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const userId = await requireUserSession(request)

	const username = await getUsernameById(userId)
	const poems = await getAllPoems(userId)

	return { username, poems }
}

export default function PoemPage() {
	const { poems } = useLoaderData<typeof loader>()
	console.log(poems)

	return (
		<main className="flex py-12 pr-14">
			<div className="w-1/4 mx-10">
				<Sidebar />
			</div>

			<div className="w-3/4 pr-16 pl-32 flex flex-col">
				<div className="h-24 flex flex-col justify-center">
					<Form className="flex relative">
						<input
							type="text"
							className="w-full py-3 rounded-sm outline-none border-none px-2 pr-11 bg-cWhite placeholder:text-sm"
							placeholder="جستجوی یک یا چند کلمه در شعر مورد نظر"
						/>
						<button className="h-1/2 absolute right-[0.6rem] top-1/2 transform -translate-y-1/2 z-10">
							<MagnifyingGlassIcon className="h-full" />
						</button>
					</Form>
				</div>

				<div className="flex flex-col gap-y-4">
					{poems.map((poem) => (
						<PoemBox key={poem.alias} {...poem} />
					))}
				</div>
			</div>
		</main>
	)
}
