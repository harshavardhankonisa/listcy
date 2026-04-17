'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import { THEMES, type Theme } from '@/common/constants/user'

// useLayoutEffect fires synchronously after React mutates the DOM but before
// the browser paints — that's the only window where we can re-apply the dark
// class after React's hydration has overwritten it, without a visible flash.
// On the server it never runs either way, but useLayoutEffect emits a warning
// there while useEffect does not, so we swap it out server-side.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

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

function isValidTheme(value: string): value is Theme {
  return (THEMES as readonly string[]).includes(value)
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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system'
    const stored = localStorage.getItem('listcy-theme')
    return stored && isValidTheme(stored) ? stored : 'system'
  })

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('listcy-theme', newTheme)
    applyThemeClass(newTheme)
  }, [])

  // This is the actual FOUC fix. React's hydration reconciles <html> and
  // overwrites its className, silently stripping the 'dark' class the
  // beforeInteractive script set. useLayoutEffect runs after that DOM mutation
  // but before the browser paints, so we put the class back in time.
  useIsomorphicLayoutEffect(() => {
    applyThemeClass(theme)
  }, [theme])

  // Listen for system theme changes when using 'system'
  useEffect(() => {
    if (theme !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyThemeClass('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  // Sync theme across browser tabs via storage event
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== 'listcy-theme' || !e.newValue) return
      if (isValidTheme(e.newValue)) {
        setThemeState(e.newValue)
        applyThemeClass(e.newValue)
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
