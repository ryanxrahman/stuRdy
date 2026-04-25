'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggleForDashboard() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="p-2 w-8 h-8" />

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full cursor-pointer bg-violet-400/10 hover:bg-violet-400/20 transition-colors group flex items-center justify-center w-8 h-8 border border-violet-400/20"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <>
          <Sun size={14} className="text-white group-hover:scale-110 transition-transform" />
        </>
      ) : (
        <>
          <Moon size={14} className="text-primary group-hover:scale-110 transition-transform" />
        </>
      )}
    </button>
  )
}
