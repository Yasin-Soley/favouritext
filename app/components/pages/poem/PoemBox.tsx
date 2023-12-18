import { Link } from '@remix-run/react'

const POEM = [
	[
		'اَلا یا اَیُّهَا السّاقی اَدِرْ کَأسَاً و ناوِلْها',
		'که عشق آسان نمود اوّل ولی افتاد مشکل‌ها',
	],
	[
		'به بویِ نافه‌ای کآخر صبا زان طُرّه بگشاید',
		'ز تابِ جَعدِ مشکینش چه خون افتاد در دل‌ها',
	],
	[
		'مرا در منزلِ جانان چه امنِ عیش چون هر دَم',
		'جَرَس فریاد می‌دارد که بَربندید مَحمِل‌ها',
	],
	[
		'به مِی سجّاده رنگین کن گَرت پیرِ مُغان گوید',
		'که سالِک بی‌خبر نَبوَد ز راه و رسمِ منزل‌ها',
	],
]

const TAGS = ['برچسب1', 'برچسب2', 'برچسب3']

export default function PoemBox() {
	return (
		<div className="rounded-sm overflow-hidden drop-shadow-md">
			<div className="py-2 px-4 flex justify-between bg-green_dark text-primary">
				<h3 className="">نام انتخابی برای شعر</h3>
				<h4 className="text-sm">نام شاعر</h4>
			</div>

			<div className="bg-green_light flex flex-col">
				<div className="flex justify-center items-center my-5">
					<ul className="text-sm">
						{POEM.map((poem, index) => (
							<li
								className={`grid grid-cols-2 gap-x-8 ${
									index !== 0 && 'mt-3'
								}`}
								key={index}
							>
								<p>{poem[0]}</p>
								<p>{poem[1]}</p>
							</li>
						))}
					</ul>
				</div>
				<p className="pr-4 pb-2">
					{TAGS.map((tag, i, arr) => (
						<span key={i}>
							<Link
								to={`?tag=${tag}`}
								className="text-xs"
								key={tag}
							>
								{tag}
							</Link>
							{i !== arr.length - 1 && ' - '}
						</span>
					))}
				</p>
			</div>
		</div>
	)
}
