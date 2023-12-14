import { Form, Link, useActionData, useNavigation } from '@remix-run/react'

import type { action } from '~/routes/auth'
import Button from './Button'
import FormControl from './FormControl'

const Auth = ({ mode }: { mode: string }) => {
	const validationErrors = useActionData<typeof action>()

	const navigation = useNavigation()

	const isLoading = navigation.state !== 'idle'

	const btnText = mode === 'login' ? 'ورود' : 'ایجاد حساب کاربری'
	const linkHref = mode === 'login' ? 'signup' : 'login'
	const linkText = {
		login: ['حساب کاربری ندارید؟', 'ساخت حساب جدید'],
		signup: ['قبلا ثبت‌نام کرده‌اید؟', 'ورود به حساب'],
	}

	return (
		<main className="flex text-tGreenP">
			<div
				className={`${
					mode === 'login' ? 'bg-login' : 'bg-register'
				} bg-cover bg-center w-1/3 h-screen`}
			>
				<div className="p-10 text-xl font-bold tracking-widest">
					<Link className="text-primary" to="/">
						LOGO
					</Link>
				</div>
			</div>

			<div className="w-2/3 flex justify-center items-center flex-col">
				<h2 className="text-2xl mb-10">
					{mode === 'login' ? 'ورود به حساب کاربری' : 'ثبت‌نام'}
				</h2>

				<Form method="post" className="w-1/2 flex flex-col gap-y-4">
					{mode === 'signup' && (
						<FormControl
							label="نام کاربری"
							id="username"
							type="text"
							name="username"
							autoComplete="text"
						/>
					)}

					<FormControl
						label="آدرس ایمیل"
						id="email"
						type="email"
						name="email"
						autoComplete="email"
					/>

					<FormControl
						label="رمز عبور"
						id="password"
						type="password"
						name="password"
						autoComplete="current-password"
					/>

					{mode === 'signup' && (
						<FormControl
							label="تکرار رمز عبور"
							id="repeated-password"
							type="password"
							name="repeated-password"
							autoComplete="current-password"
						/>
					)}

					<Button
						isButton
						isLoading={isLoading}
						type="submit"
						className="bg-tGreenS hover:bg-hover disabled:hover:bg-tGreenS  text-cWhite w-full py-3"
					>
						{btnText}
					</Button>

					{validationErrors && (
						<ul className="mb-4">
							{Object.values(validationErrors).map((error) => (
								<li
									className="text-red-600 text-sm"
									key={error}
								>
									{error}
								</li>
							))}
						</ul>
					)}

					<p className="text-xs text-center">
						{mode === 'login'
							? linkText.login[0]
							: linkText.signup[0]}
						<Link
							className="mx-2 underline"
							to={`?mode=${linkHref}`}
						>
							{mode === 'login'
								? linkText.login[1]
								: linkText.signup[1]}
						</Link>
					</p>
				</Form>
			</div>
		</main>
	)
}
export default Auth
