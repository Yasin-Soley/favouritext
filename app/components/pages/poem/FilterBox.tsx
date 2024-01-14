import { useSearchParams } from '@remix-run/react'
import { useEffect, useState } from 'react'

interface FilterProps {
	heading: string
	data: string[]
	border?: boolean
}

export default function FilterBox({ heading, data, border }: FilterProps) {
	const [showAllOptions, setShowAllOptions] = useState(false)
	// const [selectedItems, setSelectedItems] = useState<string[]>([])
	const [filterParams, setFilterParams] = useState<string[]>([])

	const [searchParams, setSearchParams] = useSearchParams()

	let params = searchParams.get('filters') || ''
	useEffect(() => {
		if (params !== '')
			setFilterParams(params.split(',').filter((s) => s !== ''))
	}, [params])

	console.log('f', filterParams)

	const handleCheckboxChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		item: string
	) => {
		const isChecked = e.target.checked
		const selectedItems = searchParams.get('filters') || ''

		const selectedItemsArray = selectedItems
			.split(',')
			.filter((s) => s !== '')

		console.log(selectedItemsArray)

		// Toggle the selection
		if (isChecked) {
			const updatedItems = [...selectedItemsArray, item]
			console.log(updatedItems)

			setSearchParams({ filters: updatedItems.join(',') })
		} else {
			const updatedItems = selectedItemsArray.filter(
				(selectedItem) => selectedItem !== item
			)
			console.log(updatedItems)
			setSearchParams({ filters: updatedItems.join(',') })
		}
	}

	if (!showAllOptions) data = data.slice(0, 3)

	let btnText = showAllOptions ? '- بستن' : '+ بیشتر'

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
							<input
								type="checkbox"
								name={item}
								id={item}
								checked={filterParams.includes(item)}
								onChange={(e) => handleCheckboxChange(e, item)}
							/>
							<label htmlFor={item}>{item}</label>
						</li>
					))
				)}
				<button
					onClick={() => setShowAllOptions((prevState) => !prevState)}
					className="text-right text-xs mt-4"
				>
					{btnText}
				</button>
			</ul>
		</div>
	)
}
