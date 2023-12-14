import Sidebar from '~/components/PoemPage/Sidebar'

export default function PoemPage() {
	return (
		<main className="flex py-8 pr-14">
			<div className="w-1/4 mx-10">
				<Sidebar />
			</div>

			<div className="w-3/4">poem</div>
		</main>
	)
}
