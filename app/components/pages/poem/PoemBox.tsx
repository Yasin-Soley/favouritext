import { Link } from '@remix-run/react'

import Button from '@/components/common/Button'
import type { Poem } from '@/data/poem.server'
import { PencilIcon, XCircleIcon } from '@heroicons/react/24/solid'

interface PoemBoxProps extends Poem {
	id: string
}

export default function PoemBox({
	alias,
	poet,
	lines,
	tags,
	id,
}: PoemBoxProps) {
	return (
		<div className="rounded-sm overflow-hidden drop-shadow-md" id={id}>
			<div className="py-2 px-4 flex justify-between bg-green_dark text-primary">
				<h3 className="">{alias}</h3>
				<h4 className="text-sm">{poet}</h4>
			</div>

			<div className="bg-green_light flex flex-col relative">
				<div className="flex justify-center items-center my-5">
					<ul className="text-sm">
						{lines.map((poem, index) => (
							<li
								className={`grid grid-cols-2 gap-x-8 ${
									index !== 0 && 'mt-3'
								}`}
								key={index}
							>
								<p>{poem.p1}</p>
								<p>{poem.p2}</p>
							</li>
						))}
					</ul>
				</div>
				<p className="pr-4 pb-2">
					{tags.map((tag, i, arr) => (
						<span key={i}>
							<Link
								to={`?tag=${tag}`}
								className="text-xs"
								key={tag}
							>
								{tag}
							</Link>
							{i !== arr.length - 1 && ' - '}
						</span>
					))}
				</p>
				<div className="flex justify-center gap-x-4 mb-2">
					<Button
						to={`/poem/${id}`}
						className="flex justify-center items-center hover:gap-x-2 gap-x-1  hover:space-x-3 transition-all duration-200 ease-in-out rounded-sm w-24 text-xs text-primary bg-green_dark px-2 py-1"
					>
						ویرایش
						<PencilIcon className="w-5" />
					</Button>
					<Button
						to={`/poem/${id}/delete`}
						className="flex justify-center items-center hover:gap-x-2 gap-x-1  hover:space-x-3 transition-all duration-150 ease-in-out rounded-sm w-24 text-xs bg-red-400  hover:bg-red-500 text-primary px-2 py-1"
						preventScrollReset
					>
						حذف
						<XCircleIcon className="w-5" />
					</Button>
				</div>
			</div>
		</div>
	)
}
