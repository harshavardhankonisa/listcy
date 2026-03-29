'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/client/config/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSocialLoading, setIsSocialLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailSignIn = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }
    setIsLoading(true)
    setError(null)

    try {
      const res = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/',
      })
      if (res.error) {
        setError(res.error.message ?? 'Invalid email or password.')
        setIsLoading(false)
      } else {
        router.push('/')
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  const handleGitHubSignIn = async () => {
    setIsSocialLoading(true)
    setError(null)

    try {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/',
      })
    } catch {
      setError('Something went wrong. Please try again.')
      setIsSocialLoading(false)
    }
  }

  const busy = isLoading || isSocialLoading

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-sm flex-col gap-6 px-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Welcome to Listcy
          </h1>
          <p className="text-center text-zinc-600 dark:text-zinc-400">
            Sign in to create, share, and discover curated lists.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Email / Password form */}
        <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={busy}
              className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-blue-600 hover:underline dark:text-blue-400"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={busy}
              className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="h-10 rounded-lg bg-blue-600 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
          <span className="text-xs text-zinc-500">OR</span>
          <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
        </div>

        {/* GitHub SSO */}
        <button
          onClick={handleGitHubSignIn}
          disabled={busy}
          className="flex h-10 w-full items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white text-sm font-medium text-black transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
        >
          {isSocialLoading ? (
            <svg
              className="h-5 w-5 animate-spin text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {isSocialLoading ? 'Signing in…' : 'Sign in with GitHub'}
        </button>

        {/* Register link */}
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/register"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Sign up
          </Link>
        </p>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-500">
          By signing in, you agree to our terms of service and privacy policy.
        </p>
      </main>
    </div>
  )
}
