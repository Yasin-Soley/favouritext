import { useState, useEffect } from 'react'
import { PlusCircleIcon } from '@heroicons/react/24/solid'
import { Link } from '@remix-run/react'

export default function FAB() {
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
			className="fixed z-50 left-10 bg-green_dark w-12 h-12 rounded-full overflow-hidden"
		>
			<button className="block w-full">
				<Link to="/addpoem">
					<PlusCircleIcon className="text-primary" />
				</Link>
			</button>
		</div>
	)
}
