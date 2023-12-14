import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

import { getUserFromSession } from '~/data/auth.server'
import { getUsernameById } from '~/data/user.server'

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
   const username = useLoaderData<typeof loader>()

   return (
      <div>
         <h1>Hello {username}!</h1>
         <Link to='/dictionary'>Dictionary</Link>
      </div>
   )
}
