import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'

import { getUserFromSession, getUsernameById } from '@/data/auth.server'
import Button from '@/components/common/Button'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Write For Life' },
		{
			name: 'description',
			content:
				'a place for writing, remembering, noting, and everything that comes with it!',
		},
	]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const userId = await getUserFromSession(request)

	if (!userId) return 'friend'

	const username = await getUsernameById(userId)

	return username
}

export default function Index() {
	return (
		<main className="mx-28 my-10">
			<section className="flex rounded-sm overflow-hidden h-64">
				<div className="w-2/5 bg-landingMain bg-no-repeat bg-center bg-cover"></div>
				<div className="w-3/5 bg-cWhite p-8 text-center">
					<h3 className="text-2xl font-bold">چرا فکر نویس؟</h3>
					<p className=" mt-8 mb-5">
						فکر نویس یک پلتفرم آنلاین، امن و سریع برای ثبت علایق
						شخصی شماست.
					</p>
					<p className="mb-8">
						برای دیدن بخش های مختلف آن روی دکمه زیر کلیک کنید.
					</p>

					<Button
						to="#content"
						className="py-2 px-5 bg-green_dark text-primary font-bold"
					>
						من را به آنجا ببر
					</Button>
				</div>
			</section>

			<section className="flex rounded-sm overflow-hidden h-80 my-10">
				<div className="w-1/4 bg-landingPoem bg-cover bg-center bg-no-repeat"></div>
				<div className="flex-1 flex flex-col justify-center">
					<div className="bg-cWhite h-2/3 text-center py-5">
						<h3 className="text-xl font-bold">گنجینه اشعار</h3>
						<p className="mt-10 mb-8">
							فضایی شخصی برای ثبت اشعار مورد علاقه‌ی شما!
						</p>
						<Button
							className="bg-green_dark py-3 px-5 rounded-sm text-primary"
							to="/poem"
						>
							رفتن به صفحه
						</Button>
					</div>
				</div>
			</section>

			<section className="flex rounded-sm overflow-hidden h-80">
				<div className="flex-1 flex flex-col justify-center">
					<div className="bg-cWhite h-2/3 text-center py-5">
						<h3 className="text-xl font-bold">دیکشنری شخصی</h3>
						<p className="mt-10 mb-8">
							فضایی شخصی برای ثبت کلمات انگلیسی مورد علاقه‌ی شما!
						</p>
						<Button
							className="bg-green_dark py-3 px-5 rounded-sm text-primary"
							to="/poem"
						>
							رفتن به صفحه
						</Button>
					</div>
				</div>
				<div className="w-1/4 bg-landingDictionary bg-cover bg-center bg-no-repeat"></div>
			</section>
		</main>
	)
}
