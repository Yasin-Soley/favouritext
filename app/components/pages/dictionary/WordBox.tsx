import type { Word } from '@prisma/client'

export default function WordBox({
	word,
	meanings,
	appearance,
	definitions,
	examples,
}: Word) {
	return (
		<div dir="ltr" className="rounded-sm overflow-hidden drop-shadow-md">
			<div className="py-2 px-4 flex justify-between bg-green_dark text-primary">
				<h3 className="mr-auto">{word}</h3>
				<h4 className="text-sm flex gap-x-2">
					{meanings.map((mean, index) => (
						<span key={index} className="px-1">
							{mean}
						</span>
					))}
				</h4>
			</div>

			<div className="bg-green_light p-4">
				<div>
					<h5 className="font-bold text-sm mb-2">Definition</h5>
					<ol className="pl-6 list-decimal text-sm">
						{definitions.map((def, index) => (
							<li key={index}>{def}</li>
						))}
					</ol>
				</div>

				<div className="text-sm">
					<h5 className="font-bold text-sm mt-2 mb-1">Example</h5>
					<ol className="pl-6 list-decimal text-sm">
						{examples.map((example, index) => (
							<li key={index} className="">
								{example}
							</li>
						))}
					</ol>
				</div>

				<div className="text-xs">
					<h6 className="font-bold text-sm mt-2 mb-1">
						Where have I seen it?
					</h6>
					{appearance.map((appearance, index) => (
						<p key={index} className="pl-3">
							{appearance}
						</p>
					))}
				</div>
			</div>
		</div>
	)
}
