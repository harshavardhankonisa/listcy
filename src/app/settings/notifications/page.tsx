'use client'

export default function NotificationsSettingsPage() {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Notifications
      </h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Notification preferences are coming soon. You can manage email and push
        notification settings from the{' '}
        <a
          href="/settings/preferences"
          className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Preferences
        </a>{' '}
        page for now.
      </p>
    </div>
  )
}
