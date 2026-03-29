'use client'

import { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Header onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
      <Sidebar isOpen={sidebarOpen} />

      {/* Main content — offset by header height and sidebar width */}
      <main className="mt-14 lg:ml-60">
        <div className="p-6">{children}</div>
      </main>
    </>
  )
}
