import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/api/config/auth'
import { AppShell } from '@/client/components/layout/AppShell'
import { DashboardNav } from '@/client/components/dashboard/DashboardNav'

export const metadata = {
  title: 'Dashboard',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth/login')

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 md:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 md:w-52">
          <div className="sticky top-20">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-sm font-bold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                {session.user.name?.charAt(0)?.toUpperCase() ?? '?'}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {session.user.name ?? 'User'}
                </p>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  Creator Dashboard
                </p>
              </div>
            </div>
            <DashboardNav />
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </AppShell>
  )
}
