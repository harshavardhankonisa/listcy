'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/client/config/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setIsLoading(true)
    setError(null)

    try {
      const res = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: '/',
      })
      if (res.error) {
        setError(res.error.message ?? 'Registration failed. Please try again.')
        setIsLoading(false)
      } else {
        router.push('/')
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
            Create an account
          </h1>
          <p className="text-center text-zinc-600 dark:text-zinc-400">
            Join Listcy to create and discover curated lists.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              disabled={isLoading}
              className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
            />
          </div>
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
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              disabled={isLoading}
              className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="h-10 rounded-lg bg-blue-600 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {isLoading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-zinc-500">
          By signing up, you agree to our terms of service and privacy policy.
        </p>
      </main>
    </div>
  )
}
