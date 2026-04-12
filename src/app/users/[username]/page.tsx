import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import * as userService from '@/api/services/user.service'
import * as listService from '@/api/services/list.service'
import * as collectionService from '@/api/services/collection.service'
import { AppShell } from '@/client/components/layout/AppShell'
import { ProfileTabs } from '@/client/components/common/ProfileTabs'

type Props = { params: Promise<{ username: string }> }

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
    twitter: {
      card: profile.avatarUrl ? 'summary_large_image' : 'summary',
      title: `${name} — Listcy`,
      description: profile.bio ?? `${name}'s public lists on Listcy`,
    },
  }
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params
  const profile = await userService.getPublicProfile(username)
  if (!profile) notFound()

  const [lists, collections, stats] = await Promise.all([
    listService.getPublicListsByUserId(profile.userId),
    collectionService.getPublicCollectionsByUserId(profile.userId),
    userService.getPublicStats(profile.userId),
  ])

  const displayName = profile.displayName ?? `@${username}`
  const initial = (profile.displayName ?? '?').charAt(0).toUpperCase()

  // Serialize dates for client component
  const serializedLists = lists.map((l) => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  }))
  const serializedCollections = collections.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }))

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        {/* Banner */}
        <div className="mb-6 h-32 rounded-2xl bg-linear-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800 sm:h-40" />

        {/* Profile header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          {/* Avatar */}
          <div className="-mt-14 ml-4 sm:-mt-16 sm:ml-6">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt=""
                width={112}
                height={112}
                className="h-24 w-24 rounded-full border-4 border-white object-cover dark:border-zinc-950 sm:h-28 sm:w-28"
                unoptimized
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-zinc-200 text-3xl font-bold text-zinc-600 dark:border-zinc-950 dark:bg-zinc-700 dark:text-zinc-300 sm:h-28 sm:w-28">
                {initial}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 px-4 sm:px-0 sm:pt-2">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {displayName}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
              <span>@{username}</span>
              <span className="hidden sm:inline">·</span>
              <span>
                {stats.listCount} {stats.listCount === 1 ? 'list' : 'lists'}
              </span>
              <span>·</span>
              <span>
                {stats.collectionCount}{' '}
                {stats.collectionCount === 1 ? 'collection' : 'collections'}
              </span>
            </div>
            {profile.bio && (
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Tabs: Lists & Collections */}
        <ProfileTabs
          lists={serializedLists}
          collections={serializedCollections}
          authorName={displayName}
          authorUsername={username}
          authorAvatarUrl={profile.avatarUrl}
        />
      </div>
    </AppShell>
  )
}
