// import { useState } from 'react'
import { Form, Outlet, useLoaderData, useSearchParams } from '@remix-run/react'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

import { getUsernameById, requireUserSession } from '@/data/auth.server'
import { getAllPoems } from '@/data/poem.server'
import PoemBox from '@/components/pages/poem/PoemBox'
import Sidebar from '@/components/pages/poem/Sidebar'
import FAB from '@/components/common/FAB'
import Button from '@/components/common/Button'
import { useRef, useState } from 'react'
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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
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

	return { username, poems, tagsFilter, poetsFilter }
}

export default function PoemPage() {
	const { poems } = useLoaderData<typeof loader>()

	const [searchTerm, setSearchTerm] = useState('')

	const [searchParams] = useSearchParams()
	let params = searchParams.get('filters') || ''
	const filters = params.split(',').filter((filter) => filter.trim() !== '')

	const searchInputRef = useRef<HTMLInputElement>(null)

	const filterPoems = () => {
		if (!searchTerm.trim() && filters.length === 0) return poems

		const lowercasedSearchTerm = searchTerm.toLowerCase()

		return poems.filter(
			(poem) =>
				(filters.length === 0 || // Check if filters array is empty
					filters.some(
						(item) =>
							// Add your specific conditions for selected items
							poem.poet.toLowerCase().includes(item) ||
							poem.alias.toLowerCase().includes(item) ||
							poem.tags.some((tag) =>
								tag.toLowerCase().includes(item)
							) ||
							poem.lines.some((line) =>
								[line.p1, line.p2].some((text) =>
									text.toLowerCase().includes(item)
								)
							)
					)) && // Add your existing search term conditions
				(poem.poet.toLowerCase().includes(lowercasedSearchTerm) ||
					poem.alias.toLowerCase().includes(lowercasedSearchTerm) ||
					poem.tags.some((tag) =>
						tag.toLowerCase().includes(lowercasedSearchTerm)
					) ||
					poem.lines.some((line) =>
						[line.p1, line.p2].some((text) =>
							text.toLowerCase().includes(lowercasedSearchTerm)
						)
					))
		)
	}

	return (
		<>
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
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								ref={searchInputRef}
							/>
							<button className="h-1/2 absolute right-[0.6rem] top-1/2 transform -translate-y-1/2 z-10">
								<MagnifyingGlassIcon className="h-full" />
							</button>
						</Form>
					</div>

					<div className="flex flex-col gap-y-4">
						{poems.length === 0 && (
							<p className="mt-5 text-center">
								هنوز شعری اضافه نکرده اید. از{' '}
								<Button
									className="px-4 py-1 w-10 bg-green_dark text-primary"
									to="add"
								>
									اینجا
								</Button>{' '}
								اقدام کنید!
							</p>
						)}
						{poems.length > 0 && filterPoems().length === 0 && (
							<p className="mt-5 text-center flex flex-col items-center gap-y-5">
								شعری یافت نشد!
								<Button
									className="px-4 block py-2 w-32 bg-green_dark text-primary"
									isButton
									onClick={() => {
										setSearchTerm('')
										searchInputRef.current?.focus()
									}}
								>
									حذف فیلتر سرچ
								</Button>
							</p>
						)}
						{filterPoems().map((poem) => (
							<PoemBox key={poem.id} {...poem} />
						))}
					</div>

					<div className="mt-10 bg-red-50">
						{/* <PaginatedItems poems={poems} itemsPerPage={3} /> */}
					</div>
				</div>

				<FAB pos="left" to="/poem/add" />
			</main>
			<Outlet />
		</>
	)
}
