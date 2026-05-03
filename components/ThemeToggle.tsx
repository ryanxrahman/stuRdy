'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggleFixed() {
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
    <div
      onClick={toggleTheme}
      className='p-2 bg-base-100 border border-base-300 rounded-xl shadow-lg text-base-content'
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </div>
  )
}

export function ThemeToggle() {
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
      className="p-2 rounded-xl bg-base-300 hover:bg-base-200 transition-colors cursor-pointer group flex items-center justify-center w-full gap-2 border border-base-content/5 text-base-content"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <>
          <Sun size={14} className="text-orange-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium">Light Mode</span>
        </>
      ) : (
        <>
          <Moon size={14} className="text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium">Dark Mode</span>
        </>
      )}
    </button>
  )
}
