'use client'

import { useState } from 'react'

interface FollowButtonProps {
  userId: string
}

export function FollowButton({ userId: _userId }: FollowButtonProps) {
  const [following, setFollowing] = useState(false)

  return (
    <button
      onClick={() => setFollowing((f) => !f)}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
        following
          ? 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
          : 'bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300'
      }`}
    >
      {following ? 'Following' : 'Follow'}
    </button>
  )
}
