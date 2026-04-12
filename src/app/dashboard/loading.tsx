export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="h-8 w-32 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-10 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Stats row */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="mt-2 h-7 w-12 rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="h-5 w-28 rounded bg-zinc-200 dark:bg-zinc-800 mb-3" />
      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-zinc-200 px-4 py-3 last:border-b-0 dark:border-zinc-800"
          >
            <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="hidden h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-700 sm:block" />
            <div className="hidden h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-700 sm:block" />
            <div className="h-4 w-8 rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>
        ))}
      </div>
    </div>
  )
}
