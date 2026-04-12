import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'

/**
 * Wraps children in a Link to the author's profile when username is available,
 * otherwise renders a plain span. Never silently drops children.
 */
function AuthorLink({
  username,
  className,
  children,
}: {
  username?: string | null
  className?: string
  children: ReactNode
}) {
  if (username) {
    return (
      <Link href={`/users/${username}`} className={className}>
        {children}
      </Link>
    )
  }
  return <span className={className}>{children}</span>
}

export interface ListCardProps {
  id: string
  slug: string
  title: string
  author: string
  authorUsername?: string | null
  authorAvatarUrl?: string | null
  itemCount: number
  tags: string[]
  timeAgo: string
  coverImage?: string | null
}

export function ListCard({
  slug,
  title,
  author,
  authorUsername,
  authorAvatarUrl,
  itemCount,
  tags,
  timeAgo,
  coverImage,
}: ListCardProps) {
  return (
    <div className="group cursor-pointer">
      {/* Thumbnail */}
      <Link href={`/lists/${slug}`}>
        <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-xl bg-zinc-200 dark:bg-zinc-800">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              height={100}
              width={100}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg
                className="h-12 w-12 text-zinc-400 dark:text-zinc-600"
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
          {/* Item count badge */}
          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="flex gap-3">
        {/* Avatar — always links to profile */}
        <AuthorLink username={authorUsername} className="mt-0.5 shrink-0">
          {authorAvatarUrl ? (
            <Image
              src={authorAvatarUrl}
              alt={author}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white uppercase">
              {author[0] ?? '?'}
            </div>
          )}
        </AuthorLink>
        <div className="flex flex-col">
          <Link
            href={`/lists/${slug}`}
            className="line-clamp-2 text-sm font-medium leading-5 text-black group-hover:text-zinc-700 dark:text-white dark:group-hover:text-zinc-300"
          >
            {title}
          </Link>
          {/* Author name — always links to profile */}
          <AuthorLink
            username={authorUsername}
            className="mt-0.5 text-xs text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            {author}
          </AuthorLink>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            {tags.length > 0 ? tags[0] : 'General'} · {timeAgo}
          </p>
        </div>
      </div>
    </div>
  )
}
