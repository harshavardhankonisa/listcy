'use client'

import { useState } from 'react'
import Link from 'next/link'
import { authClient } from '@/client/config/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email address.')
      return
    }
    setIsLoading(true)
    setError(null)

    try {
      const res = await authClient.requestPasswordReset({
        email,
        redirectTo: '/auth/reset-password',
      })
      if (res.error) {
        setError(res.error.message ?? 'Something went wrong. Please try again.')
        setIsLoading(false)
      } else {
        setSubmitted(true)
        setIsLoading(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-sm flex-col gap-6 px-6">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Reset your password
          </h1>
          <p className="text-center text-zinc-600 dark:text-zinc-400">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        {submitted ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
            <p className="font-medium">Check your email</p>
            <p className="mt-1">
              If an account exists for <strong>{email}</strong>, we&apos;ve sent
              a password reset link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                disabled={isLoading}
                className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="h-10 rounded-lg bg-blue-600 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {isLoading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Back to sign in
          </Link>
        </p>
      </main>
    </div>
  )
}
