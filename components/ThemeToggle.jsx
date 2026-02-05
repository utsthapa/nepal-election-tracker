'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral bg-surface/60 hover:bg-surface transition-colors"
      aria-label="Toggle light and dark mode"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-blue-500" />
      )}
      <span className="text-sm font-medium text-foreground">
        {isDark ? 'Light mode' : 'Dark mode'}
      </span>
    </button>
  )
}
