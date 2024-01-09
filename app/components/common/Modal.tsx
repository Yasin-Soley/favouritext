import type { ReactNode } from 'react'

export default function Modal({ children }: { children: ReactNode }) {
	return (
		<div
			className="bg-primary text-green_dark py-10 px-8 rounded-sm"
			onClick={(e) => e.stopPropagation()}
		>
			{children}
		</div>
	)
}
