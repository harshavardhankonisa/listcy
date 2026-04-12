export const dynamic = 'force-dynamic'

import { AppShell } from '@/client/components/layout/AppShell'
import { CategoryChips } from '@/client/components/common/CategoryChips'
import { ListCard } from '@/client/components/common/ListCard'
import * as listService from '@/api/services/list.service'

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export default async function Home() {
  const lists = await listService.getPublicLists(20, 0)

  return (
    <AppShell>
      <CategoryChips />
      <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {lists.length > 0 ? (
          lists.map((l) => (
            <ListCard
              key={l.id}
              id={l.id}
              slug={l.slug}
              title={l.title}
              author={
                l.authorDisplayName ??
                (l.authorUsername ? `@${l.authorUsername}` : 'User')
              }
              authorUsername={l.authorUsername}
              authorAvatarUrl={l.authorAvatarUrl}
              itemCount={l.itemCount}
              tags={[]}
              timeAgo={timeAgo(l.createdAt)}
              coverImage={l.coverImage}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <svg
              className="mb-4 h-16 w-16 text-zinc-300 dark:text-zinc-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <h2 className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
              No lists yet
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Sign in and create the first list!
            </p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
