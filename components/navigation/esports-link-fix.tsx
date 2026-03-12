'use client'

import { useEffect } from 'react'

export default function EsportsLinkFix() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const anchor = target?.closest('a[href="#"]') as HTMLAnchorElement | null
      if (!anchor) return

      if (anchor.textContent?.trim().toLowerCase() !== 'esports') return

      event.preventDefault()
      window.location.href = '/esports'
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}
