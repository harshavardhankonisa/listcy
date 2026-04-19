import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { auth } from '@/api/config/auth'
import * as listService from '@/api/services/list.service'
import * as userService from '@/api/services/user.service'
import { AppShell } from '@/client/components/layout/AppShell'
import { ListActionBar } from '@/client/components/common/ListActionBar'
import { FollowButton } from '@/client/components/common/FollowButton'
import type { ListType } from '@/common/enums/list'

type Props = { params: Promise<{ slug: string }> }

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const list = await listService.getListBySlug(slug)
  if (!list) return { title: 'List not found' }

  return {
    title: list.title,
    description: list.description ?? `A ${list.type} list on Listcy`,
    openGraph: {
      title: list.title,
      description: list.description ?? `A ${list.type} list on Listcy`,
      type: 'article',
      ...(list.coverImage ? { images: [{ url: list.coverImage }] } : {}),
    },
    twitter: {
      card: list.coverImage ? 'summary_large_image' : 'summary',
      title: list.title,
      description: list.description ?? `A ${list.type} list on Listcy`,
    },
  }
}

export default async function PublicListPage({ params }: Props) {
  const { slug } = await params

  let userId: string | null = null
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    userId = session?.user?.id ?? null
  } catch {}

  const list = await listService.getListBySlug(slug, userId)
  if (!list) notFound()

  const type = list.type as ListType

  const [profile, creatorLists, relatedLists] = await Promise.all([
    userService.getProfile(list.userId),
    listService.getPublicListsByUserId(list.userId, 5, 0),
    listService.getRelatedLists(list.id, type, 6),
  ])

  const otherLists = creatorLists.filter((l) => l.id !== list.id)

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 lg:flex-row">
        {/* Main content — left */}
        <div className="min-w-0 flex-1">
          {/* Cover image */}
          {list.coverImage && (
            <div className="relative mb-6 h-48 overflow-hidden rounded-xl sm:h-64">
              <Image
                src={list.coverImage}
                alt={list.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          {/* Header */}
          <div className="mb-6">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[type]}`}
              >
                {TYPE_LABELS[type]}
              </span>
              <span className="text-xs capitalize text-zinc-400">
                {list.visibility}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {list.title}
            </h1>
            {profile?.username && (
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                by{' '}
                <Link
                  href={`/users/${profile.username}`}
                  className="font-medium text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
                >
                  {profile.displayName ?? `@${profile.username}`}
                </Link>
              </p>
            )}
            {list.description && (
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
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

            {/* Action bar */}
            <div className="mt-4">
              <ListActionBar listId={list.id} listTitle={list.title} />
            </div>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-3">
            {list.items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No items yet.
                </p>
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
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt=""
                      width={48}
                      height={48}
                      className="shrink-0 rounded-lg object-cover"
                      unoptimized
                    />
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
        </div>

        {/* Sidebar — right (desktop) */}
        <aside className="w-full shrink-0 lg:w-72">
          {/* Creator card */}
          {profile?.username && (
            <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <Link href={`/users/${profile.username}`} className="shrink-0">
                  {profile.avatarUrl ? (
                    <Image
                      src={profile.avatarUrl}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-sm font-bold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                      {(profile.displayName ?? '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
                <div className="min-w-0">
                  <Link
                    href={`/users/${profile.username}`}
                    className="block truncate text-sm font-semibold text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
                  >
                    {profile.displayName ?? `@${profile.username}`}
                  </Link>
                  <Link
                    href={`/users/${profile.username}`}
                    className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    @{profile.username}
                  </Link>
                </div>
              </div>
              {profile.bio && (
                <p className="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {profile.bio}
                </p>
              )}
              {/* Follow button */}
              <div className="mt-3">
                <FollowButton userId={profile.userId} />
              </div>
            </div>
          )}

          {/* More lists by this creator */}
          {otherLists.length > 0 && (
            <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {profile?.username ? (
                  <Link
                    href={`/users/${profile.username}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    More by this creator →
                  </Link>
                ) : (
                  'More by this creator'
                )}
              </h3>
              <div className="flex flex-col gap-2">
                {otherLists.map((l) => (
                  <Link
                    key={l.id}
                    href={`/lists/${l.slug}`}
                    className="group flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[l.type as ListType]}`}
                    >
                      {TYPE_LABELS[l.type as ListType]}
                    </span>
                    <span className="min-w-0 truncate text-sm text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-100">
                      {l.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Lists (Up Next) */}
          {relatedLists.length > 0 && (
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Up Next
              </h3>
              <div className="flex flex-col gap-3">
                {relatedLists.map((r) => (
                  <Link
                    key={r.id}
                    href={`/lists/${r.slug}`}
                    className="group flex gap-3 rounded-lg p-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800">
                      {r.coverImage ? (
                        <Image
                          src={r.coverImage}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <svg
                            className="h-5 w-5 text-zinc-400 dark:text-zinc-600"
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
                        </div>
                      )}
                      <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white">
                        {r.itemCount} items
                      </span>
                    </div>
                    {/* Info */}
                    <div className="flex min-w-0 flex-col">
                      <span className="line-clamp-2 text-sm font-medium text-zinc-900 group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300">
                        {r.title}
                      </span>
                      {r.authorDisplayName && (
                        <span className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                          {r.authorDisplayName}
                        </span>
                      )}
                      <span
                        className={`mt-1 self-start rounded px-1.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[r.type as ListType]}`}
                      >
                        {TYPE_LABELS[r.type as ListType]}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </AppShell>
  )
}
