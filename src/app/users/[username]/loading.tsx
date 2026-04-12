import { AppShell } from '@/client/components/layout/AppShell'

export default function ProfileLoading() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl animate-pulse">
        {/* Banner */}
        <div className="mb-6 h-32 rounded-2xl bg-zinc-200 dark:bg-zinc-800 sm:h-40" />

        {/* Profile header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="-mt-14 ml-4 sm:-mt-16 sm:ml-6">
            <div className="h-24 w-24 rounded-full border-4 border-white bg-zinc-200 dark:border-zinc-950 dark:bg-zinc-700 sm:h-28 sm:w-28" />
          </div>
          <div className="flex-1 px-4 sm:px-0 sm:pt-2">
            <div className="h-7 w-48 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="mt-2 flex gap-3">
              <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
            <div className="mt-3 h-10 w-80 rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="h-5 w-16 rounded bg-zinc-200 dark:bg-zinc-700 mb-3" />
          <div className="h-5 w-24 rounded bg-zinc-200 dark:bg-zinc-700 mb-3" />
        </div>

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
