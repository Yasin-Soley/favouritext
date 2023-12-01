import { Form, Link, useRouteLoaderData } from '@remix-run/react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

import Button from './Button'

export default function MainNavigation() {
	const userId = useRouteLoaderData('root')
	console.log(userId)

	return (
		<nav className="flex justify-start px-14 py-5">
			<div className="px-8 py-1 text-xl font-bold tracking-widest">
				<Link className="text-primary" to="/">
					LOGO
				</Link>
			</div>

			<div className="w-1/3 hidden sm:block">
				<Form className="flex h-full relative">
					<input
						type="text"
						className="w-full h-full rounded-sm outline-none border-none px-2 pr-11 text-sm"
						placeholder="جستجو..."
					/>
					<button className="h-3/4 absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
						<MagnifyingGlassIcon className=" h-full" />
					</button>
				</Form>
			</div>

			<div className="mr-auto gap-x-2">
				{userId ? (
					<Form action="/logout" method="DELETE">
						<Button className="bg-primary " isButton>
							خروج
						</Button>
					</Form>
				) : (
					<>
						<Button
							className="bg-primary border-l-2 border-secondary rounded-tl-none rounded-bl-none"
							to="/auth?mode=login"
						>
							ورود
						</Button>
						<Button
							className="bg-primary  rounded-tr-none rounded-br-none"
							to="/auth?mode=signup"
						>
							ثبت‌نام
						</Button>
					</>
				)}
			</div>
		</nav>
	)
}
