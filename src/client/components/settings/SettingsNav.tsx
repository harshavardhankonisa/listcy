'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Profile', href: '/settings' },
  { label: 'Account', href: '/settings/account' },
  { label: 'Preferences', href: '/settings/preferences' },
  { label: 'Notifications', href: '/settings/notifications' },
]

export function SettingsNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-zinc-100 text-black dark:bg-zinc-800 dark:text-white'
                : 'text-zinc-600 hover:bg-zinc-50 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
