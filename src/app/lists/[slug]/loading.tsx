import { AppShell } from '@/client/components/layout/AppShell'

export default function ListLoading() {
  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-7xl animate-pulse flex-col gap-8 lg:flex-row">
        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Cover image placeholder */}
          <div className="mb-6 h-48 rounded-xl bg-zinc-200 dark:bg-zinc-800 sm:h-64" />

          {/* Header */}
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-5 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-4 w-14 rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
            <div className="h-9 w-3/4 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="mt-3 h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="mt-3 h-12 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>

          {/* Items */}
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="h-7 w-7 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                <div className="flex-1">
                  <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-700" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:w-72">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <div>
                <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="mt-1 h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-700" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  )
}
