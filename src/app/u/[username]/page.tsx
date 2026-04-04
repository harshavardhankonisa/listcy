import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import * as userService from '@/api/services/user.service'
import * as listService from '@/api/services/list.service'
import { AppShell } from '@/client/components/layout/AppShell'
import type { ListType } from '@/constants/list'

type Props = { params: Promise<{ username: string }> }

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
  const { username } = await params
  const profile = await userService.getPublicProfile(username)
  if (!profile) return { title: 'User not found' }

  const name = profile.displayName ?? `@${username}`
  return {
    title: `${name} — Listcy`,
    description: profile.bio ?? `${name}'s public lists on Listcy`,
    openGraph: {
      title: `${name} — Listcy`,
      description: profile.bio ?? `${name}'s public lists on Listcy`,
      type: 'profile',
      ...(profile.avatarUrl ? { images: [{ url: profile.avatarUrl }] } : {}),
    },
  }
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params
  const profile = await userService.getPublicProfile(username)
  if (!profile) notFound()

  const lists = await listService.getPublicListsByUserId(profile.userId)

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        {/* Profile header */}
        <div className="mb-8 flex items-center gap-5">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt=""
              width={80}
              height={80}
              className="rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-200 text-2xl font-bold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
              {(profile.displayName ?? '?').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {profile.displayName ?? `@${username}`}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              @{username}
            </p>
            {profile.bio && (
              <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Public lists */}
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Public Lists ({lists.length})
        </h2>

        {lists.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No public lists yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lists.map((l) => (
              <Link
                key={l.id}
                href={`/lists/${l.slug}`}
                className="group rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                {l.coverImage && (
                  <div className="relative mb-3 h-28 w-full overflow-hidden rounded-lg">
                    <Image
                      src={l.coverImage}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${TYPE_COLORS[l.type as ListType]}`}
                  >
                    {TYPE_LABELS[l.type as ListType]}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {l.itemCount} {l.itemCount === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300">
                  {l.title}
                </h3>
                {l.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {l.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
