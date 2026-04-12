import { headers } from 'next/headers'
import Link from 'next/link'
import { auth } from '@/api/config/auth'
import * as dashboardService from '@/api/services/dashboard.service'
import * as listService from '@/api/services/list.service'
import type { ListType } from '@/constants/list'

const TYPE_LABELS: Record<ListType, string> = {
  ranked: 'Ranked',
  resources: 'Resources',
  checklist: 'Checklist',
  watchlist: 'Watchlist',
  general: 'General',
}

const TYPE_COLORS: Record<ListType, string> = {
  ranked:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  resources: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  checklist:
    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  watchlist:
    'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  general: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null

  const [stats, { lists: recentLists }] = await Promise.all([
    dashboardService.getStats(session.user.id),
    listService.getListsByUserIdPaginated(session.user.id, 5, 0),
  ])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Dashboard
        </h1>
        <Link
          href="/dashboard/lists/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          + Create List
        </Link>
      </div>

      {/* Stats row */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Lists', value: stats.totalLists },
          { label: 'Total Items', value: stats.totalItems },
          { label: 'Public', value: stats.publicLists },
          { label: 'Private', value: stats.privateLists },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent lists */}
      <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Recent Lists
      </h2>
      {recentLists.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No lists yet. Create your first list to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Title
                </th>
                <th className="hidden px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 sm:table-cell">
                  Type
                </th>
                <th className="hidden px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 sm:table-cell">
                  Visibility
                </th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Items
                </th>
                <th className="hidden px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 md:table-cell">
                  Created
                </th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
              {recentLists.map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/lists/${l.slug}/edit`}
                      className="font-medium text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
                    >
                      {l.title}
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[l.type as ListType]}`}
                    >
                      {TYPE_LABELS[l.type as ListType]}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400 sm:table-cell capitalize">
                    {l.visibility}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {l.itemCount}
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400 md:table-cell">
                    {new Date(l.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/lists/${l.slug}/edit`}
                      className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {recentLists.length > 0 && (
        <div className="mt-3 text-right">
          <Link
            href="/dashboard/lists"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            View all lists →
          </Link>
        </div>
      )}
    </div>
  )
}
