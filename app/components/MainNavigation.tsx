import { Form, Link, useLoaderData } from '@remix-run/react'

export default function MainNavigation() {
	const userId = useLoaderData()

	return (
		<ul className="flex justify-center gap-x-4 text-xl">
			<li>
				{userId ? (
					<Form action="/logout" method="DELETE">
						<button>Logout</button>
					</Form>
				) : (
					<Link to="/auth">Sign Up</Link>
				)}
			</li>
			<li>
				<Link to="/dictionary">Dictionary</Link>
			</li>
			<li>
				<Link to="/">Home</Link>
			</li>
		</ul>
	)
}
