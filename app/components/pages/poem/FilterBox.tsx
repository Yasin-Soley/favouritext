import { useState } from 'react'

interface FilterProps {
	type: 'poets' | 'tags'
	heading: string
	data: string[]
	border?: boolean
}

export default function FilterBox({
	type,
	heading,
	data,
	border,
}: FilterProps) {
	const [showAllOptions, setShowAllOptions] = useState({
		tags: false,
		poets: false,
	})

	if (!showAllOptions[type]) data = data.slice(0, 3)

	const handleMoreButtonClick = () => {
		const newState = { ...showAllOptions }
		newState[type] = !newState[type]

		setShowAllOptions(newState)
	}

	let btnText = showAllOptions[type] ? '- بستن' : '+ بیشتر'

	return (
		<div className={`${border && 'border-b border-main'} py-5`}>
			<h5 className="mb-5 font-bold text-sm">{heading}</h5>

			<ul className="flex flex-col gap-y-2 text-sm">
				{data.length === 0 ? (
					<p className="text-xs flex flex-col">
						ابتدا شعری ثبت کنید.
					</p>
				) : (
					data.map((item, i) => (
						<li key={i} className="flex gap-x-2">
							<input type="checkbox" name={item} id={item} />
							<label htmlFor={item}>{item}</label>
						</li>
					))
				)}
				<button
					onClick={handleMoreButtonClick}
					className="text-right opacity-80 "
				>
					{btnText}
				</button>
			</ul>
		</div>
	)
}
