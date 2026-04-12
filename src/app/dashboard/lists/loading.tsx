export default function ListsLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-8 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-2 h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="h-10 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        {Array.from({ length: 8 }).map((_, i) => (
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
