'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/lists', label: 'My Lists', icon: '📝' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {links.map(({ href, label, icon }) => {
        const active =
          href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(href)

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100'
            }`}
          >
            <span className="text-base">{icon}</span>
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
