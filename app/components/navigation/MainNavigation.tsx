import { Form, Link, useRouteLoaderData } from '@remix-run/react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

import Button from '../Button'
import NavigateLink from './NavigateLink'

export default function MainNavigation() {
	const userId = useRouteLoaderData('root')

	return (
		<nav className="px-14 pt-5">
			{/* top-div */}
			<div className="flex">
				<div className="px-8 py-1 text-xl font-bold tracking-widest">
					<Link className="text-primary" to="/">
						LOGO
					</Link>
				</div>

				<div className="hidden sm:block w-1/3">
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
							<Button className="bg-main " isButton>
								خروج
							</Button>
						</Form>
					) : (
						<>
							<Button
								className="bg-main border-l-2 border-secondary rounded-tl-none rounded-bl-none"
								to="/auth?mode=login"
							>
								ورود
							</Button>
							<Button
								className="bg-main  rounded-tr-none rounded-br-none"
								to="/auth?mode=signup"
							>
								ثبت‌نام
							</Button>
						</>
					)}
				</div>
			</div>

			{/* bottom-div */}
			<div className="flex justify-center mt-6">
				<ul className="flex text-main gap-x-10">
					<li>
						<NavigateLink to={`/poem`}>گنجینه اشعار</NavigateLink>
					</li>

					<li>
						<NavigateLink to={`/dictionary`}>
							دیکشنری شخصی
						</NavigateLink>
					</li>

					<li>
						<Link
							className="block px-2 py-3 transition hover:bg-main  hover:text-green_dark"
							to={`#footer`}
						>
							ارتباط با سازنده
						</Link>
					</li>
				</ul>
			</div>
		</nav>
	)
}
