import { Link, useLoaderData } from '@remix-run/react'

import type { loader } from '@/routes/_app.poem'

import { alphabets } from '@/utils'

export default function Sidebar() {
	const { username } = useLoaderData<typeof loader>()

	return (
		<>
			<div className="h-24">
				<h3 className="font-bold text-2xl text-center">دیکشنری شخصی</h3>
				<p className="mt-5 text-sm text-center">
					{username}، خوش آمدید!
				</p>
			</div>
			<div className="flex flex-col rounded-sm overflow-hidden">
				<div className="bg-green_dark text-primary px-5 py-4 flex justify-between">
					<h4 className="text-lg">حروف الفبا</h4>

					<button className="text-xs border-b border-inherit">
						حذف فیلتر ها
					</button>
				</div>

				<div className="text-green_dark bg-green_light p-5">
					<ul dir="ltr" className="grid grid-cols-4 gap-2">
						{alphabets.map((char) => (
							<li
								className="text-center hover:bg-green_dark hover:text-primary cursor-pointer transition-colors rounded-sm"
								key={char}
							>
								<Link
									preventScrollReset
									className="block w-full h-full"
									to={`?term=${char}`}
								>
									{char}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</>
	)
}
