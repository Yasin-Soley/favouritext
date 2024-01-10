import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'

import { getUsernameById, requireUserSession } from '@/data/auth.server'

import Sidebar from '@/components/pages/dictionary/Sidebar'
import { Form } from '@remix-run/react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import WordBox from '@/components/pages/dictionary/WordBox'
import FAB from '@/components/common/FAB'

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
	return username
}

export default function Dictionary() {
	return (
		<main className="flex py-12 pr-14">
			<div className="w-3/4 pr-32 pl-16 flex flex-col">
				<div dir="ltr" className="h-24 flex flex-col justify-center">
					<Form className="flex relative">
						<input
							type="text"
							className="w-full py-3 rounded-sm outline-none border-none px-2 pl-11 bg-cWhite placeholder:text-sm"
							placeholder="search a word..."
						/>
						<button className="h-1/2 absolute left-[0.6rem] top-1/2 transform -translate-y-1/2 z-10">
							<MagnifyingGlassIcon className="h-full" />
						</button>
					</Form>
				</div>

				<div className="flex flex-col gap-y-4">
					<WordBox />
					<WordBox />
					<WordBox />
				</div>
			</div>

			<div className="w-1/4 mx-10">
				<Sidebar />
			</div>

			<FAB pos="right" to="/dictionary/add" />
		</main>
	)
}
