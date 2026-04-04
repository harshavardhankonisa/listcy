import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/api/config/auth'
import * as listService from '@/api/services/list.service'
import { AppShell } from '@/client/components/layout/AppShell'
import { AddItemForm } from '@/client/lists/AddItemForm'
import type { ListType } from '@/constants/list'

type Props = { params: Promise<{ id: string }> }

const TYPE_LABELS: Record<ListType, string> = {
  ranked: 'Ranked',
  resources: 'Resources',
  checklist: 'Checklist',
  watchlist: 'Watchlist',
  general: 'General',
}

const TYPE_COLORS: Record<ListType, string> = {
  ranked: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  resources: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  checklist:
    'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  watchlist:
    'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  general: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
}

export default async function ListPage({ params }: Props) {
  const { id } = await params

  let userId: string | null = null
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    userId = session?.user?.id ?? null
  } catch {}

  const list = await listService.getListById(id, userId)
  if (!list) notFound()

  const isOwner = userId === list.userId
  const type = list.type as ListType

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[type]}`}
            >
              {TYPE_LABELS[type]}
            </span>
            <span className="text-xs text-zinc-400">
              {list.visibility === 'public'
                ? 'Public'
                : list.visibility === 'unlisted'
                  ? 'Unlisted'
                  : 'Private'}
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {list.title}
          </h1>
          {list.description && (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {list.description}
            </p>
          )}
          {list.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {list.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Items */}
        <div className="flex flex-col gap-3">
          {list.items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No items yet.
              </p>
              {isOwner && (
                <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                  Add your first item below.
                </p>
              )}
            </div>
          ) : (
            list.items.map((item, index) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                {type === 'ranked' && (
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {index + 1}
                  </span>
                )}
                {type === 'checklist' && (
                  <div className="mt-0.5 h-5 w-5 shrink-0 rounded border-2 border-zinc-300 dark:border-zinc-600" />
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {item.title}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add item — owner only */}
        {isOwner && (
          <div className="mt-4">
            <AddItemForm listId={id} />
          </div>
        )}
      </div>
    </AppShell>
  )
}
