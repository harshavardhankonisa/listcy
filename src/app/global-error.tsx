'use client'

/**
 * Root-layout error boundary (Next.js App Router global-error).
 *
 * WHY THIS FILE EXISTS ALONGSIDE error.tsx:
 * error.tsx catches errors thrown inside route segments but cannot catch
 * errors that occur inside the root layout (app/layout.tsx) itself —
 * because the root layout wraps every segment, an error there would leave
 * Next.js with no layout to render error.tsx into.
 *
 * global-error.tsx is the escape hatch for that case: it replaces the
 * entire document (including <html> and <body>) so something is always
 * shown to the user even if the root layout is broken.
 *
 * WHERE: Placed at app/global-error.tsx — Next.js picks it up automatically.
 * Only fires for root-layout-level failures; all other errors still go to
 * the nearest error.tsx boundary.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            Something went wrong
          </h1>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            className="mt-6 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
