'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
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

type ListRow = {
  id: string
  slug: string
  title: string
  type: string
  visibility: string
  itemCount: number
  coverImage: string | null
  createdAt: Date | string
}

export function ListsTable({ lists }: { lists: ListRow[] }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(slug: string) {
    if (!confirm('Are you sure you want to delete this list?')) return
    setDeleting(slug)
    try {
      const resp = await fetch(`/api/lists/${slug}`, { method: 'DELETE' })
      if (resp.ok) router.refresh()
    } finally {
      setDeleting(null)
    }
  }

  if (lists.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No lists yet.
        </p>
        <Link
          href="/dashboard/lists/new"
          className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          Create your first list →
        </Link>
      </div>
    )
  }

  return (
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
            <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
          {lists.map((l) => (
            <tr key={l.id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {l.coverImage ? (
                    <Image
                      src={l.coverImage}
                      alt=""
                      width={32}
                      height={32}
                      className="rounded object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-100 text-xs dark:bg-zinc-800">
                      📝
                    </div>
                  )}
                  <Link
                    href={`/dashboard/lists/${l.slug}/edit`}
                    className="font-medium text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
                  >
                    {l.title}
                  </Link>
                </div>
              </td>
              <td className="hidden px-4 py-3 sm:table-cell">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[l.type as ListType]}`}
                >
                  {TYPE_LABELS[l.type as ListType]}
                </span>
              </td>
              <td className="hidden px-4 py-3 text-xs capitalize text-zinc-500 dark:text-zinc-400 sm:table-cell">
                {l.visibility}
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {l.itemCount}
              </td>
              <td className="hidden px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400 md:table-cell">
                {new Date(l.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/lists/${l.slug}/edit`}
                    className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(l.slug)}
                    disabled={deleting === l.slug}
                    className="text-xs font-medium text-red-600 hover:text-red-500 disabled:opacity-50 dark:text-red-400"
                  >
                    {deleting === l.slug ? '...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
