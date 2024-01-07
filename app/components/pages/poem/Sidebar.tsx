import type { loader } from '@/routes/_app.poem'
import FilterBox from './FilterBox'
import { useLoaderData } from '@remix-run/react'

export default function Sidebar() {
	const { username, tagsFilter, poetsFilter } = useLoaderData<typeof loader>()

	return (
		<>
			<div className="h-24">
				<h3 className="font-bold text-2xl text-center">بخوان مرا</h3>
				<p className="mt-5 text-sm text-center">
					{username}، خوش آمدید!
				</p>
			</div>
			<div className="flex flex-col rounded-sm overflow-hidden">
				<div className="bg-green_dark text-primary px-5 py-4 flex justify-between">
					<h4 className="text-lg">فیلتر ها</h4>

					<button className="text-xs border-b border-inherit">
						حذف فیلتر ها
					</button>
				</div>

				<div className="text-green_dark bg-green_light px-5">
					<FilterBox
						heading="بر اساس شاعر"
						data={poetsFilter}
						border
					/>
					<FilterBox heading="بر اساس موضوع" data={tagsFilter} />
				</div>
			</div>
		</>
	)
}
