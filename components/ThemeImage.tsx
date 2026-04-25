'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function ThemeImage({ 
  lightSrc, 
  darkSrc, 
  alt, 
  ...props 
}: { 
  lightSrc: string, 
  darkSrc: string, 
  alt: string,
  [key: string]: any 
}) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder or the light version during hydration
    return <Image src={lightSrc} alt={alt} {...props} />
  }

  return (
    <div className="transition-opacity duration-500 ease-in-out">
      <Image
        src={resolvedTheme === 'dark' ? darkSrc : lightSrc}
        alt={alt}
        {...props}
        className={`${props.className || ''} transition-all duration-700`}
      />
    </div>
  )
}
