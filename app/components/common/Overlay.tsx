import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface OverlayProps {
	onClick: () => void
	children: ReactNode
}

export default function Overlay({ onClick, children }: OverlayProps) {
	const root = document.getElementById('root')!

	if (root)
		return createPortal(
			<>
				<div
					className={`fixed top-0 left-0 z-50 bg-black bg-opacity-40 w-screen h-screen flex justify-center items-center`}
					onClick={onClick}
				>
					{children}
				</div>
			</>,
			root
		)
	else return null
}
