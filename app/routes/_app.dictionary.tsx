import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'

import { getUsernameById, requireUserSession } from '@/data/auth.server'

import Sidebar from '@/components/pages/dictionary/Sidebar'
import { Form, Outlet, useLoaderData } from '@remix-run/react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import WordBox from '@/components/pages/dictionary/WordBox'
import FAB from '@/components/common/FAB'
import { getAllWords } from '@/data/word.server'
import Button from '@/components/common/Button'
import { useRef, useState } from 'react'

export const meta: MetaFunction = () => {
	return [
		{ title: 'My World, My Word' },
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

	const words = await getAllWords(userId)

	return { username, words }
}

export default function Dictionary() {
	const { words } = useLoaderData<typeof loader>()

	const [searchTerm, setSearchTerm] = useState('')

	const searchInputRef = useRef<HTMLInputElement>(null)

	const filterWords = () => {
		if (!searchTerm.trim()) return words

		const lowercasedSearchTerm = searchTerm.toLowerCase()

		return words.filter(
			(word) =>
				word.word.toLowerCase().includes(lowercasedSearchTerm) ||
				word.meanings.some((meaning) =>
					meaning.toLowerCase().includes(lowercasedSearchTerm)
				) ||
				word.definitions.some((definition) =>
					definition.toLowerCase().includes(lowercasedSearchTerm)
				) ||
				word.examples.some((example) =>
					example.toLowerCase().includes(lowercasedSearchTerm)
				) ||
				word.appearance.some((appearance) =>
					appearance.toLowerCase().includes(lowercasedSearchTerm)
				)
		)
	}

	return (
		<>
			<main className="flex py-12 pr-14">
				<div className="w-3/4 pr-32 pl-16 flex flex-col">
					<div
						dir="ltr"
						className="h-24 flex flex-col justify-center"
					>
						<Form className="flex relative">
							<input
								type="text"
								className="w-full py-3 rounded-sm outline-none border-none px-2 pl-11 bg-cWhite placeholder:text-sm"
								placeholder="search a word..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								ref={searchInputRef}
							/>
							<button className="h-1/2 absolute left-[0.6rem] top-1/2 transform -translate-y-1/2 z-10">
								<MagnifyingGlassIcon className="h-full" />
							</button>
						</Form>
					</div>

					<div className="flex flex-col gap-y-4">
						{words.length === 0 && (
							<p className="mt-5 text-center">
								هنوز واژه‌ای اضافه نکرده اید. از{' '}
								<Button
									className="px-4 py-1 w-10 bg-green_dark text-primary"
									to="add"
								>
									اینجا
								</Button>{' '}
								اقدام کنید!
							</p>
						)}
						{words.length > 0 && filterWords().length === 0 && (
							<p className="mt-5 text-center flex flex-col items-center gap-y-5">
								واژه‌ای یافت نشد!
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
						{filterWords().map((word) => (
							<WordBox key={word.id} {...word} />
						))}
					</div>
				</div>

				<div className="w-1/4 mx-10">
					<Sidebar />
				</div>

				<FAB pos="right" to="/dictionary/add" />
			</main>
			<Outlet />
		</>
	)
}
