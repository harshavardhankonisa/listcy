'use client'

import { useState } from 'react'
import { authClient } from '@/client/config/auth'

export default function AccountSettingsPage() {
  const { data: session, isPending } = authClient.useSession()
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  if (isPending) {
    return <div className="text-sm text-zinc-500">Loading…</div>
  }

  const user = session?.user

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Account
      </h2>

      {message && (
        <div
          className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400'
              : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex max-w-lg flex-col gap-6">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>
          <p className="text-sm text-zinc-900 dark:text-zinc-100">
            {user?.email ?? '—'}
          </p>
        </div>

        {/* Account created */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Member since
          </label>
          <p className="text-sm text-zinc-900 dark:text-zinc-100">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : '—'}
          </p>
        </div>

        {/* Danger zone */}
        <div className="mt-4 rounded-lg border border-red-200 p-4 dark:border-red-800">
          <h3 className="text-sm font-medium text-red-700 dark:text-red-400">
            Danger Zone
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Account deletion is permanent and cannot be undone.
          </p>
          <button
            onClick={() =>
              setMessage({
                type: 'error',
                text: 'Account deletion is not yet available.',
              })
            }
            className="mt-3 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
          >
            Delete account
          </button>
        </div>
      </div>
    </div>
  )
}
