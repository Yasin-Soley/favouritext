import { Link } from '@remix-run/react'

import Separator from '../common/Seperator'
import ChevronLeft from '../common/icons/ChevronLeft'

import icon1 from '~/imgs/footer-icon-2.png'
import icon2 from '~/imgs/footer-icon-3.png'
import icon3 from '~/imgs/footer-icon-1.png'
import InstagramIcon from '~/imgs/icon-instagram.png'
import TelegramIcon from '~/imgs/icon-telegram.png'
import FacebookIcon from '~/imgs/icon-facebook.png'
import SkypeIcon from '~/imgs/icon-skype.png'

export default function Footer() {
	return (
		<footer className="bg-green_dark text-primary" id="footer">
			<div className="flex">
				<div className="w-1/2 pt-10 pb-4">
					<div className="flex justify-center gap-x-8 text-lg">
						<figure className="flex flex-col items-center gap-y-4">
							<img
								src={icon1}
								alt="trust-worthy"
								className="w-16 h-16"
							/>
							<figcaption>حفظ درختان</figcaption>
						</figure>
						<figure className="flex flex-col items-center gap-y-4">
							<img
								src={icon2}
								alt="quick"
								className="w-16 h-16"
							/>
							<figcaption>سریع</figcaption>
						</figure>
						<figure className="flex flex-col items-center gap-y-4">
							<img
								src={icon3}
								alt="saving trees"
								className="w-16 h-16"
							/>
							<figcaption>مطمئن</figcaption>
						</figure>
					</div>

					<Separator />

					<div className="flex gap-x-8 justify-center">
						<div>
							<h4 className="flex gap-x-2 font-bold items-center">
								<ChevronLeft />
								دسترسی سریع
							</h4>
							<ul className="flex flex-col gap-y-3 pr-7 mt-5 text-sm">
								<li>
									<Link to="/poem">شعر</Link>
								</li>
								<li>
									<Link to="/dictionary">دیکشنری</Link>
								</li>
								<li>
									<Link to="/dictionary">دیکشنری</Link>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="flex gap-x-2 font-bold items-center">
								<ChevronLeft />
								تماس با ما
							</h4>
							<ul className="flex flex-col gap-y-3 pr-7 mt-5 text-sm">
								<li>
									<Link to="#">ایمیل</Link>
								</li>
								<li>
									<Link to="#">تلگرام</Link>
								</li>
							</ul>
						</div>
					</div>

					<Separator />

					<div className="flex justify-center items-center">
						<ul className="flex gap-x-5 h-9">
							<li>
								<Link to="#">
									<img
										className="block h-full object-cover"
										src={InstagramIcon}
										alt="social media - instagram"
									/>
								</Link>
							</li>
							<li>
								<Link to="#">
									<img
										className="block h-full object-cover"
										src={TelegramIcon}
										alt="social media - telegram"
									/>
								</Link>
							</li>
							<li>
								<Link to="#">
									<img
										className="block h-full object-cover"
										src={FacebookIcon}
										alt="social media - facebook"
									/>
								</Link>
							</li>
							<li>
								<Link to="#">
									<img
										className="block h-full object-cover"
										src={SkypeIcon}
										alt="social media - skype"
									/>
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className="w-1/2 bg-footer bg-cover"></div>
			</div>
			<p className="bg-cWhite py-3 text-green_dark text-center">
				&copy; کلیه حقوق این وب سایت متعلق به سازندگان آن است.
			</p>
		</footer>
	)
}
