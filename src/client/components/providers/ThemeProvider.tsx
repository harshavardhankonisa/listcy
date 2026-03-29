'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import type { Theme } from '@/constants/user'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  setTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

function applyThemeClass(theme: Theme) {
  const root = document.documentElement

  if (theme === 'system') {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    root.classList.toggle('dark', prefersDark)
  } else {
    root.classList.toggle('dark', theme === 'dark')
  }
}

export function ThemeProvider({
  children,
  initialTheme = 'system',
}: {
  children: React.ReactNode
  initialTheme?: Theme
}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return initialTheme
    const stored = localStorage.getItem('listcy-theme') as Theme | null
    return stored && ['light', 'dark', 'system'].includes(stored)
      ? stored
      : initialTheme
  })

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('listcy-theme', newTheme)
    applyThemeClass(newTheme)
  }, [])

  // Apply theme class on mount
  useEffect(() => {
    applyThemeClass(theme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for system theme changes when using 'system'
  useEffect(() => {
    if (theme !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyThemeClass('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
