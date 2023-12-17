import FilterBox from './FilterBox'

const POETS = ['حافظ', 'سعدی', 'مولانا']
const SUBJECTS = ['عشق', 'نفرت', 'دوستی']

export default function Sidebar() {
	return (
		<>
			<div className="h-32">
				<h3 className="font-bold text-2xl text-center">بخوان مرا</h3>
				<p className="text-center mt-5 ">
					کاربر عزیز، به صفحه شعر شخصی خوش آمدید!
				</p>
			</div>
			<div className="flex flex-col rounded-sm overflow-hidden">
				<div className="bg-green_dark text-primary px-5 py-4 flex justify-between">
					<h4 className="text-lg">فیلتر ها</h4>

					<button className="text-xs border-b border-inherit">
						حذف فیلتر ها
					</button>
				</div>

				<div className="text-green_dark bg-green_light px-5">
					<FilterBox heading="بر اساس شاعر" data={POETS} border />
					<FilterBox heading="بر اساس موضوع" data={SUBJECTS} />
				</div>
			</div>
		</>
	)
}
