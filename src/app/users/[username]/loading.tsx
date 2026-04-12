import { AppShell } from '@/client/components/layout/AppShell'

export default function ProfileLoading() {
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl animate-pulse">
        {/* Profile header */}
        <div className="mb-8 flex items-center gap-5">
          <div className="h-20 w-20 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div>
            <div className="h-7 w-48 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="mt-2 h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="mt-3 h-10 w-64 rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>
        </div>

        {/* Lists header */}
        <div className="mb-4 h-6 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-3 h-28 w-full rounded-lg bg-zinc-200 dark:bg-zinc-700" />
              <div className="mb-2 flex items-center gap-2">
                <div className="h-4 w-14 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-3 w-12 rounded bg-zinc-200 dark:bg-zinc-700" />
              </div>
              <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
