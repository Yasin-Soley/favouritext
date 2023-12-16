import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { Form } from '@remix-run/react'
import type { FormEvent } from 'react'
import PoemBox from '~/components/PoemPage/PoemBox'
import Sidebar from '~/components/PoemPage/Sidebar'

export default function PoemPage() {
	const handleTagClick = (tag: string, e: FormEvent) => {
		e.preventDefault()
		const currentSearchParams = new URLSearchParams(window.location.search)
		const currentTags = currentSearchParams.get('tags')
		const updatedTags = currentTags
			? !currentTags.split(',').includes(tag)
				? `${currentTags},${tag}`
				: currentTags
			: tag
		currentSearchParams.set('tags', updatedTags)
		const updatedSearch = `?${currentSearchParams.toString()}`
		window.location.search = updatedSearch
	}

	return (
		<main className="flex py-12 pr-14">
			<div className="w-1/4 mx-10">
				<Sidebar />
			</div>

			<div className="w-3/4 pr-16 pl-32">
				<div className="h-1/6 flex flex-col justify-center">
					<Form className="flex relative">
						<input
							type="text"
							className="w-full py-3 rounded-sm outline-none border-none px-2 pr-11 bg-cWhite"
							placeholder="جستجو"
						/>
						<button className="h-1/2 absolute right-[0.6rem] top-1/2 transform -translate-y-1/2 z-10">
							<MagnifyingGlassIcon className="h-full" />
						</button>
					</Form>
				</div>

				<div className="flex flex-col gap-y-4">
					<PoemBox onTagClick={handleTagClick} />
					<PoemBox onTagClick={handleTagClick} />
					<PoemBox onTagClick={handleTagClick} />
				</div>
			</div>
		</main>
	)
}
