import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'

import type { Poem } from '@/data/poem.server'

import PoemBox from '../pages/poem/PoemBox'

function Items({ currentItems }: { currentItems: Poem[] }) {
	return currentItems.map((item) => <PoemBox key={item.alias} {...item} />)
}

interface Props {
	itemsPerPage: number
	poems: Poem[]
}

export default function PaginatedItems({ itemsPerPage = 5, poems }: Props) {
	const [currentItems, setCurrentItems] = useState<Poem[]>([])
	const [pageCount, setPageCount] = useState(0)
	const [itemOffset, setItemOffset] = useState(0)

	useEffect(() => {
		const endOffset = itemOffset + itemsPerPage
		console.log(`Loading items from ${itemOffset} to ${endOffset}`)
		setCurrentItems(poems.slice(itemOffset, endOffset))
		setPageCount(Math.ceil(poems.length / itemsPerPage))
	}, [itemOffset, itemsPerPage, poems])

	// Invoke when user click to request another page.
	const handlePageClick = (event: { selected: number }) => {
		const newOffset = (event.selected * itemsPerPage) % poems.length
		console.log(
			`User requested page number ${event.selected}, which is offset ${newOffset}`
		)
		setItemOffset(newOffset)
	}

	return (
		<div className="mt-10 bg-red-50">
			<Items currentItems={currentItems} />
			<ReactPaginate
				nextLabel="next >"
				onPageChange={handlePageClick}
				pageRangeDisplayed={3}
				marginPagesDisplayed={2}
				pageCount={pageCount}
				previousLabel="< previous"
				pageClassName="page-item"
				pageLinkClassName="page-link"
				previousClassName="page-item"
				previousLinkClassName="page-link"
				nextClassName="page-item"
				nextLinkClassName="page-link"
				breakLabel="..."
				breakClassName="page-item"
				breakLinkClassName="page-link"
				containerClassName="pagination"
				activeClassName="active"
			/>
		</div>
	)
}
