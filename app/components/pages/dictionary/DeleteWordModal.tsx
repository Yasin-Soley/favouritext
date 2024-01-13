import { Form, Link, useNavigate } from '@remix-run/react'

import Button from '../../common/Button'
import Modal from '../../common/Modal'
import Overlay from '@/components/common/Overlay'

interface DeleteWordModalProps {
	word: string
	username: string
	wordId: string
}

export default function DeleteWordModal({
	username,
	word,
	wordId,
}: DeleteWordModalProps) {
	const navigate = useNavigate()

	const handleModalClose = () => {
		navigate('/dictionary', { preventScrollReset: true })
	}

	return (
		<Overlay onClick={handleModalClose}>
			<Modal>
				<p>
					{username} عزیز، شما در حال حذف کردن واژه‌ی
					<Link
						className="font-bold border-b-2 border-b-green_dark rounded-sm mx-3 pb-1"
						to={`/dictionary/#${wordId}`}
					>
						{word}
					</Link>{' '}
					هستید.
				</p>
				<p className="mt-2">آیا مطمئنید؟</p>

				<div className="flex justify-center gap-x-4 mt-5">
					<Button
						className="bg-green_dark text-primary w-24 px-4 py-2"
						isButton
						onClick={handleModalClose}
					>
						بازگشت
					</Button>
					<Form method="DELETE">
						<Button
							className="bg-red-400 hover:bg-red-500 transition-colors text-primary w-24 px-4 py-2"
							type="submit"
							isButton
						>
							بله
						</Button>
					</Form>
				</div>
			</Modal>
		</Overlay>
	)
}
