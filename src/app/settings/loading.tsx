export default function SettingsLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-4 h-6 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="flex max-w-lg flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-10 w-full rounded-lg bg-zinc-200 dark:bg-zinc-700" />
          </div>
        ))}
        <div className="mt-2 h-10 w-32 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  )
}
