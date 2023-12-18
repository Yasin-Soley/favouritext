export default function WordBox() {
	return (
		<div dir="ltr" className="rounded-sm overflow-hidden drop-shadow-md">
			<div className="py-2 px-4 flex justify-between bg-green_dark text-primary">
				<h3 className="mr-auto">WORD</h3>
				<h4 className="text-sm flex gap-x-2">
					<span className="px-1">ترجمه1</span>
					<span className="px-1">ترجمه2</span>
					<span className="px-1">ترجمه3</span>
				</h4>
			</div>

			<div className="bg-green_light p-4">
				<div>
					<h5 className="font-bold text-sm mb-2">definition</h5>
					<ol className="pl-6 list-decimal text-xs">
						<li>some explanation</li>
						<li>some other explanation </li>
						<li>yet some other explanation </li>
					</ol>
				</div>

				<div className="text-xs">
					<h5 className="font-bold text-sm mt-2 mb-1">example</h5>
					<p className="pl-3">
						a sentence as an example of using the word
					</p>
				</div>

				<div className="text-xs">
					<h6 className="font-bold text-sm mt-2 mb-1">
						where have I seen?
					</h6>
					<p className="pl-3">in XXXXX series</p>
				</div>
			</div>
		</div>
	)
}
