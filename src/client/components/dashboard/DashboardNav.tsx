'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLink {
  href: string
  label: string
  icon: string
  exact?: boolean
}

const mainLinks: NavLink[] = [
  { href: '/dashboard', label: 'Overview', icon: '📊', exact: true },
  { href: '/dashboard/lists', label: 'My Lists', icon: '📝' },
]

const quickLinks: NavLink[] = [
  {
    href: '/dashboard/lists/new',
    label: 'Create List',
    icon: '➕',
    exact: true,
  },
]

const accountLinks: NavLink[] = [
  { href: '/settings', label: 'Settings', icon: '⚙️' },
]

export function DashboardNav() {
  const pathname = usePathname()
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.profile?.username) setUsername(data.profile.username)
      })
      .catch(() => {})
  }, [])

  const profileLink: NavLink[] = username
    ? [
        {
          href: `/users/${username}`,
          label: 'Your Profile',
          icon: '👤',
          exact: true,
        },
      ]
    : []

  return (
    <nav className="flex flex-col gap-4">
      <NavGroup links={mainLinks} pathname={pathname} />
      <NavGroup links={quickLinks} pathname={pathname} />
      <hr className="border-zinc-200 dark:border-zinc-800" />
      <NavGroup links={[...profileLink, ...accountLinks]} pathname={pathname} />
    </nav>
  )
}

function NavGroup({ links, pathname }: { links: NavLink[]; pathname: string }) {
  return (
    <div className="flex flex-col gap-1">
      {links.map(({ href, label, icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href)

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
    </div>
  )
}
