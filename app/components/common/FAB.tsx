import { useState, useEffect } from 'react'
import { PlusCircleIcon } from '@heroicons/react/24/solid'
import { Link } from '@remix-run/react'

interface FAbProps {
	pos: string
	to: string
}

export default function FAB({ pos, to }: FAbProps) {
	const [buttonBottom, setButtonBottom] = useState(20)

	useEffect(() => {
		const handleScroll = () => {
			const footerTop = document
				.getElementById('footer')!
				.getBoundingClientRect().top
			const newButtonBottom = Math.max(
				20,
				window.innerHeight - footerTop + 20
			)
			setButtonBottom(newButtonBottom)
		}

		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	return (
		<div
			style={{ bottom: `${buttonBottom}px` }}
			title="افزودن شعر به گنجینه"
			className={`fixed z-50 ${
				pos === 'left' ? 'left-10' : 'right-10'
			} bg-green_dark w-12 h-12 rounded-full overflow-hidden`}
		>
			<button className="block w-full">
				<Link to={to}>
					<PlusCircleIcon className="text-primary" />
				</Link>
			</button>
		</div>
	)
}
