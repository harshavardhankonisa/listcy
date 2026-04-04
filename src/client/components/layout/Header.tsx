'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/client/config/auth'

interface HeaderProps {
  onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { data: session, isPending } = authClient.useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const handleSignOut = async () => {
    setMenuOpen(false)
    await authClient.signOut()
    router.push('/')
  }

  const user = session?.user

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Toggle sidebar"
        >
          <svg
            className="h-6 w-6 text-zinc-700 dark:text-zinc-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/listcy-logo.svg"
            alt="Listcy"
            width={55}
            height={27}
            className="w-13.75 h-6.75 -mb-1"
          />
        </Link>
      </div>

      {/* Center: Search bar */}
      <div className="mx-4 hidden max-w-2xl flex-1 sm:flex">
        <div className="flex w-full">
          <input
            type="text"
            placeholder="Search"
            className="h-10 w-full rounded-l-full border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-blue-500 focus:shadow-inner dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:border-blue-400"
          />
          <button className="flex h-10 w-16 items-center justify-center rounded-r-full border border-l-0 border-zinc-200 bg-zinc-100 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700">
            <svg
              className="h-5 w-5 text-zinc-600 dark:text-zinc-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Right: Auth area */}
      <div className="flex items-center gap-2">
        {user && (
          <Link
            href="/dashboard/lists/new"
            className="hidden items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 sm:flex dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Create
          </Link>
        )}
        {/* Mobile search icon */}
        <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-zinc-100 sm:hidden dark:hover:bg-zinc-800">
          <svg
            className="h-5 w-5 text-zinc-700 dark:text-zinc-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </button>

        {/* More options */}
        <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <svg
            className="h-5 w-5 text-zinc-700 dark:text-zinc-200"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="6" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="18" r="2" />
          </svg>
        </button>

        {isPending ? (
          <div className="ml-2 h-8 w-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
        ) : user ? (
          <div className="relative ml-2" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white uppercase hover:ring-2 hover:ring-blue-400 focus:outline-none"
              aria-label="User menu"
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? 'User'}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                (user.name?.[0] ?? user.email?.[0] ?? 'U')
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {user.email}
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="ml-2 flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:border-zinc-800 dark:text-blue-400 dark:hover:bg-blue-950"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Sign in
          </Link>
        )}
      </div>
    </header>
  )
}
