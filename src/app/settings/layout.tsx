import { AppShell } from '@/client/components/layout/AppShell'
import { SettingsNav } from '@/client/components/settings/SettingsNav'

export const metadata = {
  title: 'Settings',
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Settings
        </h1>
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Vertical nav */}
          <aside className="w-full shrink-0 md:w-48">
            <SettingsNav />
          </aside>
          {/* Content */}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </AppShell>
  )
}
