import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black">
      <h1 className="text-6xl font-bold text-zinc-900 dark:text-zinc-100">
        404
      </h1>
      <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
        Page not found
      </p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Go home
      </Link>
    </div>
  )
}
