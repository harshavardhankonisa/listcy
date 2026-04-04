import { headers } from 'next/headers'
import Link from 'next/link'
import { auth } from '@/api/config/auth'
import * as listService from '@/api/services/list.service'
import { ListsTable } from '@/client/components/dashboard/ListsTable'

export const metadata = { title: 'My Lists' }

export default async function MyListsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null

  const { lists, total } = await listService.getListsByUserIdPaginated(
    session.user.id,
    50,
    0
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            My Lists
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {total} {total === 1 ? 'list' : 'lists'} total
          </p>
        </div>
        <Link
          href="/dashboard/lists/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          + Create List
        </Link>
      </div>

      <ListsTable lists={lists} />
    </div>
  )
}
