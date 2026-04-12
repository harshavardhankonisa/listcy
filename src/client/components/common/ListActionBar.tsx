'use client'

import { useState } from 'react'

interface ListActionBarProps {
  listId: string
  listTitle: string
}

export function ListActionBar({
  listId: _listId,
  listTitle: _listTitle,
}: ListActionBarProps) {
  const [vote, setVote] = useState<'up' | 'down' | null>(null)
  const [upCount, setUpCount] = useState(0)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  function handleUpvote() {
    if (vote === 'up') {
      setVote(null)
      setUpCount((c) => c - 1)
    } else {
      setVote('up')
      setUpCount((c) => c + (vote === 'down' ? 1 : 1))
    }
  }

  function handleDownvote() {
    if (vote === 'down') {
      setVote(null)
    } else {
      if (vote === 'up') setUpCount((c) => c - 1)
      setVote('down')
    }
  }

  async function handleShare() {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: do nothing
    }
  }

  function handleSave() {
    setSaved((s) => !s)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Upvote / Downvote pill */}
      <div className="flex items-center overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <button
          onClick={handleUpvote}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${
            vote === 'up'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-700'
          }`}
          aria-label="Upvote"
        >
          <svg
            className="h-5 w-5"
            fill={vote === 'up' ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
            />
          </svg>
          {upCount > 0 && <span>{upCount}</span>}
        </button>
        <div className="h-6 w-px bg-zinc-300 dark:bg-zinc-600" />
        <button
          onClick={handleDownvote}
          className={`px-3 py-2 transition-colors ${
            vote === 'down'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-700'
          }`}
          aria-label="Downvote"
        >
          <svg
            className="h-5 w-5 rotate-180"
            fill={vote === 'down' ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
            />
          </svg>
        </button>
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
          />
        </svg>
        {copied ? 'Copied!' : 'Share'}
      </button>

      {/* Save button */}
      <button
        onClick={handleSave}
        className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          saved
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
        }`}
      >
        <svg
          className="h-5 w-5"
          fill={saved ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
          />
        </svg>
        {saved ? 'Saved' : 'Save'}
      </button>
    </div>
  )
}
