// import { useState } from 'react'
import { Form, useLoaderData } from '@remix-run/react'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

import { getUsernameById, requireUserSession } from '@/data/auth.server'
import { getAllPoems } from '@/data/poem.server'
import PoemBox from '@/components/pages/poem/PoemBox'
import Sidebar from '@/components/pages/poem/Sidebar'
import FAB from '@/components/common/FAB'
// import PaginatedItems from '@/components/common/Pagination'

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

	let tagsFilter: string[] = poems.map((poem) => poem.tags).flat()
	tagsFilter = tagsFilter.filter(
		(item, index) => tagsFilter.indexOf(item) === index
	)

	let poetsFilter = poems.map((poem) => poem.poet)
	poetsFilter = poetsFilter.filter(
		(item, index) => poetsFilter.indexOf(item) === index
	)

	console.log(tagsFilter, poetsFilter)

	return { username, poems, tagsFilter, poetsFilter }
}

export default function PoemPage() {
	// const [poemPage, setPoemPage] = useState(1)

	const { poems } = useLoaderData<typeof loader>()

	return (
		<main className="flex py-12 px-14">
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
						<PoemBox key={poem.id} {...poem} />
					))}
				</div>

				<div className="mt-10 bg-red-50">
					{/* <PaginatedItems poems={poems} itemsPerPage={3} /> */}
				</div>
			</div>

			<FAB />
		</main>
	)
}
