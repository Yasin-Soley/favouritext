export default function WordBox() {
	return (
		<div className="bg-white bg-opacity-50 rounded-sm py-4 text-hover">
			<div className="p-4 pt-0 border-b-2 border-tertiary flex">
				<h4 className="font-bold tracking-wider mr-auto">WORD</h4>
				<span className="ml-1 px-1">ترجمه1</span>
				<span className="ml-1 px-1">ترجمه2</span>
				<span className="ml-1 px-1">ترجمه3</span>
			</div>

			<div className="px-4">
				<div className="text-xs pt-2">
					<h5 className="font-bold text-sm mt-2 mb-1">definition</h5>
					<ol className="pl-6 list-decimal">
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
