interface FilterProps {
	heading: string
	data: string[]
	border?: boolean
}

export default function FilterBox({ heading, data, border }: FilterProps) {
	return (
		<div className={`${border && 'border-b border-main'} py-5`}>
			<h5 className="mb-5 font-bold text-sm">{heading}</h5>

			<ul className="flex flex-col gap-y-2 text-sm">
				{data.map((item) => (
					<li key={item} className="flex gap-x-2">
						<input type="checkbox" name={item} id={item} />
						<label htmlFor={item}>{item}</label>
					</li>
				))}
				<button className="text-right opacity-70">+ بیشتر</button>
			</ul>
		</div>
	)
}
