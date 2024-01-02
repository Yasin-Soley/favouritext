import { Form, Link, useRouteLoaderData } from '@remix-run/react'
// import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

import Button from '../common/Button'
import NavigateLink from './NavigateLink'

export default function MainNavigation() {
	const userId = useRouteLoaderData('root')

	return (
		<nav className="px-14 pt-5">
			<div className="flex">
				<div className="px-8 py-1 text-xl font-bold tracking-widest">
					<Link className="text-primary" to="/">
						LOGO
					</Link>
				</div>

				<div className="flex justify-center mx-auto">
					<ul className="flex text-main">
						<li>
							<NavigateLink to={`/poem`}>
								گنجینه اشعار
							</NavigateLink>
						</li>

						<li>
							<NavigateLink to={`/dictionary`}>
								دیکشنری شخصی
							</NavigateLink>
						</li>

						<li>
							<Link
								className="block px-4 py-3 transition hover:bg-main  hover:text-green_dark"
								to={`#footer`}
							>
								ارتباط با سازنده
							</Link>
						</li>
					</ul>
				</div>

				<div className="gap-x-2">
					{userId ? (
						<div className="flex flex-col justify-center ">
							<Form action="/logout" method="DELETE">
								<Button className="bg-main " isButton>
									خروج
								</Button>
							</Form>
						</div>
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
		</nav>
	)
}
