'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ListCard } from '@/client/components/common/ListCard'

type Tab = 'lists' | 'collections'

export interface PublicList {
  id: string
  slug: string
  title: string
  description: string | null
  coverImage: string | null
  type: string
  itemCount: number
  createdAt: string
}

export interface PublicCollection {
  id: string
  title: string
  description: string | null
  coverImage: string | null
  createdAt: string
}

interface ProfileTabsProps {
  lists: PublicList[]
  collections: PublicCollection[]
  authorName: string
  authorUsername: string
  authorAvatarUrl: string | null
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
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
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

export function ProfileTabs({
  lists,
  collections,
  authorName,
  authorUsername,
  authorAvatarUrl,
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('lists')

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'lists', label: 'Lists', count: lists.length },
    { key: 'collections', label: 'Collections', count: collections.length },
  ]

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-6 flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-5 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs text-zinc-400 dark:text-zinc-500">
              {tab.count}
            </span>
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'lists' && (
        <ListsGrid
          lists={lists}
          authorName={authorName}
          authorUsername={authorUsername}
          authorAvatarUrl={authorAvatarUrl}
        />
      )}
      {activeTab === 'collections' && (
        <CollectionsGrid collections={collections} />
      )}
    </div>
  )
}

function ListsGrid({
  lists,
  authorName,
  authorUsername,
  authorAvatarUrl,
}: {
  lists: PublicList[]
  authorName: string
  authorUsername: string
  authorAvatarUrl: string | null
}) {
  if (lists.length === 0) {
    return <EmptyState icon="list" message="No public lists yet." />
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {lists.map((l) => (
        <ListCard
          key={l.id}
          id={l.id}
          slug={l.slug}
          title={l.title}
          author={authorName}
          authorUsername={authorUsername}
          authorAvatarUrl={authorAvatarUrl}
          itemCount={l.itemCount}
          tags={[]}
          timeAgo={timeAgo(l.createdAt)}
          coverImage={l.coverImage}
        />
      ))}
    </div>
  )
}

function CollectionsGrid({ collections }: { collections: PublicCollection[] }) {
  if (collections.length === 0) {
    return <EmptyState icon="collection" message="No public collections yet." />
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {collections.map((c) => (
        <div
          key={c.id}
          className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
        >
          {c.coverImage && (
            <div className="relative mb-3 h-28 w-full overflow-hidden rounded-lg">
              <Image
                src={c.coverImage}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          {!c.coverImage && (
            <div className="mb-3 flex h-28 w-full items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <svg
                className="h-10 w-10 text-zinc-300 dark:text-zinc-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                />
              </svg>
            </div>
          )}
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {c.title}
          </h3>
          {c.description && (
            <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
              {c.description}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
      <svg
        className="mx-auto mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        {icon === 'list' ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
          />
        )}
      </svg>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
    </div>
  )
}
