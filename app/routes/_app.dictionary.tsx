import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import WordBox from '~/components/WordBox'
import { requireUserSession } from '~/data/auth.server'
import { getUsernameById } from '~/data/user.server'
import { alphabets } from '~/utils'

export const meta: MetaFunction = () => {
   return [
      { title: 'My World, My Word' },
      {
         name: 'description',
         content:
            'This is where I store the words that are new, interesting or valuable to me.',
      },
   ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
   const userId = await requireUserSession(request)

   const username = await getUsernameById(userId)
   return username
}

export default function Dictionary() {
   const username = useLoaderData<typeof loader>()

   return (
      <main className='flex gap-x-10 pt-10 pb-5 px-10 h-5/6'>
         <div className='w-1/5'></div>
         <div className='w-3/5 px-10 flex flex-col gap-y-5'>
            <div className='h-1/5 flex flex-col gap-y-4'>
               <h2 className='text-xl text-center'>دیکشنری شخصی {username}</h2>

               <Form dir='ltr' className='flex relative'>
                  <input
                     type='text'
                     className='w-full py-3 rounded-sm outline-none border-none px-2 pl-11 bg-cWhite'
                     placeholder='search for...'
                  />
                  <button className='h-1/2 absolute left-[0.6rem] top-1/2 transform -translate-y-1/2 z-10'>
                     <MagnifyingGlassIcon className=' h-full' />
                  </button>
               </Form>
            </div>

            <div
               dir='ltr'
               className='bg-tertiary h-4/5 rounded-sm p-5 overflow-y-scroll text-tGreenP flex flex-col gap-y-4'
            >
               <WordBox />
               <WordBox />
               <WordBox />
            </div>
         </div>
         <div className='w-1/5 h-3/4 self-end pt-3 px-5 bg-tertiary rounded-sm'>
            <h3 className='text-center mb-2 border-b-2 border-primary'>
               حروف الفبا
            </h3>

            <div className='h-4/5'>
               <ul dir='ltr' className='h-full grid grid-cols-4 gap-1'>
                  {alphabets.map((char) => (
                     <li
                        className='text-center hover:bg-primary cursor-pointer transition-colors '
                        key={char}
                     >
                        <Link
                           className='block w-full h-full'
                           to={`?term=${char}`}
                        >
                           {char}
                        </Link>
                     </li>
                  ))}
               </ul>
            </div>
         </div>{' '}
      </main>
   )
}
