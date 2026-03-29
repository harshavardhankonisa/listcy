'use client'

import { useState, useEffect } from 'react'

interface Profile {
  displayName: string | null
  bio: string | null
  timezone: string | null
  avatarUrl: string | null
}

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<Profile>({
    displayName: '',
    bio: '',
    timezone: '',
    avatarUrl: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  useEffect(() => {
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          setProfile({
            displayName: data.profile.displayName ?? '',
            bio: data.profile.bio ?? '',
            timezone: data.profile.timezone ?? '',
            avatarUrl: data.profile.avatarUrl ?? '',
          })
        }
      })
      .catch(() =>
        setMessage({ type: 'error', text: 'Failed to load profile.' })
      )
      .finally(() => setIsLoading(false))
  }, [])

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated.' })
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong.' })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="text-sm text-zinc-500">Loading…</div>
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Profile
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

      <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
        <Field
          label="Display Name"
          value={profile.displayName ?? ''}
          onChange={(v) => setProfile((p) => ({ ...p, displayName: v }))}
          disabled={isSaving}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Bio
          </label>
          <textarea
            value={profile.bio ?? ''}
            onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
            rows={3}
            disabled={isSaving}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
          />
        </div>
        <Field
          label="Timezone"
          value={profile.timezone ?? ''}
          onChange={(v) => setProfile((p) => ({ ...p, timezone: v }))}
          placeholder="e.g. America/New_York"
          disabled={isSaving}
        />
        <Field
          label="Avatar URL"
          value={profile.avatarUrl ?? ''}
          onChange={(v) => setProfile((p) => ({ ...p, avatarUrl: v }))}
          placeholder="https://…"
          disabled={isSaving}
        />
        <button
          type="submit"
          disabled={isSaving}
          className="mt-2 h-10 w-fit rounded-lg bg-blue-600 px-6 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isSaving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
      />
    </div>
  )
}
