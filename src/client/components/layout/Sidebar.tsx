import Link from 'next/link'

interface SidebarProps {
  isOpen: boolean
}

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const mainNav: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3L4 9v12h5v-7h6v7h5V9z" />
      </svg>
    ),
  },
  {
    label: 'Trending',
    href: '#',
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
  },
  {
    label: 'Subscriptions',
    href: '#',
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
]

const exploreNav: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
        />
      </svg>
    ),
  },
  {
    label: 'My Lists',
    href: '/dashboard/lists',
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
    ),
  },
  {
    label: 'Library',
    href: '#',
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 19V5h14v14H5zm2-2h10M7 7h4"
        />
      </svg>
    ),
  },
  {
    label: 'History',
    href: '#',
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
]

const signInSection = (
  <div className="mx-4 mt-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
    <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
      Sign in to create your own lists, subscribe to others, and more.
    </p>
    <Link
      href="/auth/login"
      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:border-zinc-800 dark:text-blue-400 dark:hover:bg-blue-950"
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
  </div>
)

function NavSection({ items }: { items: NavItem[] }) {
  return (
    <ul className="flex flex-col px-3">
      {items.map((item) => (
        <li key={item.label}>
          <Link
            href={item.href}
            className="flex items-center gap-5 rounded-lg px-3 py-2.5 text-sm font-normal text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {item.icon}
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function Sidebar({ isOpen }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" />}

      {/* Sidebar */}
      <aside
        className={`fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-60 overflow-y-auto border-r border-zinc-200 bg-white transition-transform duration-200 dark:border-zinc-800 dark:bg-zinc-900 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <nav className="flex flex-col gap-2 py-3">
          <NavSection items={mainNav} />
          <hr className="mx-4 border-zinc-200 dark:border-zinc-800" />
          <NavSection items={exploreNav} />
          <hr className="mx-4 border-zinc-200 dark:border-zinc-800" />
          {signInSection}
        </nav>
      </aside>
    </>
  )
}
