'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/client/components/providers/ThemeProvider'
import { THEMES, type Theme } from '@/constants/user'

interface Settings {
  theme: Theme
  emailNotifications: boolean
  pushNotifications: boolean
}

export default function PreferencesPage() {
  const { setTheme } = useTheme()
  const [settings, setSettings] = useState<Settings>({
    theme: 'system',
    emailNotifications: true,
    pushNotifications: true,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  useEffect(() => {
    fetch('/api/user/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          setSettings({
            theme: data.settings.theme ?? 'system',
            emailNotifications: data.settings.emailNotifications ?? true,
            pushNotifications: data.settings.pushNotifications ?? true,
          })
        }
      })
      .catch(() =>
        setMessage({ type: 'error', text: 'Failed to load settings.' })
      )
      .finally(() => setIsLoading(false))
  }, [])

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        setTheme(settings.theme)
        setMessage({ type: 'success', text: 'Preferences updated.' })
      } else {
        setMessage({ type: 'error', text: 'Failed to update preferences.' })
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
        Preferences
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

      <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-6">
        {/* Theme */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Theme
          </label>
          <select
            value={settings.theme}
            onChange={(e) => {
              const val = e.target.value as Theme
              if (THEMES.includes(val)) {
                setSettings((s) => ({ ...s, theme: val }))
              }
            }}
            disabled={isSaving}
            className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Notifications */}
        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Notifications
          </legend>
          <Toggle
            label="Email notifications"
            description="Receive updates and activity alerts via email"
            checked={settings.emailNotifications}
            onChange={(v) =>
              setSettings((s) => ({ ...s, emailNotifications: v }))
            }
            disabled={isSaving}
          />
          <Toggle
            label="Push notifications"
            description="Receive real-time push notifications in your browser"
            checked={settings.pushNotifications}
            onChange={(v) =>
              setSettings((s) => ({ ...s, pushNotifications: v }))
            }
            disabled={isSaving}
          />
        </fieldset>

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

function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {label}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="h-4 w-4 accent-blue-600"
      />
    </label>
  )
}
