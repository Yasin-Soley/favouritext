const POETS = ['حافظ', 'سعدی', 'مولانا']
const SUBJECTS = ['عشق', 'نفرت', 'دوستی']

export default function Sidebar() {
   return (
      <>
         <h3 className='font-bold text-2xl text-center'>بخوان مرا</h3>

         <p className='text-center mt-5 mb-2'>
            کاربر عزیز، به صفحه شعر شخصی خوش آمدید!
         </p>

         <div className='flex flex-col rounded-sm overflow-hidden'>
            <div className='bg-green_dark text-primary px-5 py-4 flex justify-between'>
               <h4 className='text-lg'>فیلتر ها</h4>

               <button className='text-xs border-b border-inherit'>
                  حذف فیلتر ها
               </button>
            </div>

            <div className='text-green_dark bg-green_light px-5'>
               <div className='border-b border-main py-5'>
                  <h5 className='mb-5 font-bold text-sm'>بر اساس شاعر</h5>

                  <ul className='flex flex-col gap-y-2 text-sm'>
                     {POETS.map((poet) => (
                        <li key={poet} className='flex gap-x-2'>
                           <input type='checkbox' name={poet} id={poet} />
                           <label htmlFor={poet}>{poet}</label>
                        </li>
                     ))}
                     <button className='text-right opacity-70'>+ بیشتر</button>
                  </ul>
               </div>

               <div className='py-5'>
                  <h5 className='mb-5 font-bold text-sm'>بر اساس موضوع</h5>

                  <ul className='flex flex-col gap-y-2 text-sm'>
                     {SUBJECTS.map((subj) => (
                        <li key={subj} className='flex gap-x-2'>
                           <input type='checkbox' name={subj} id={subj} />
                           <label htmlFor={subj}>{subj}</label>
                        </li>
                     ))}

                     <button className='text-right opacity-70'>+ بیشتر</button>
                  </ul>
               </div>
            </div>
         </div>
      </>
   )
}
