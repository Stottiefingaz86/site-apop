'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { DailySpinPopup } from './daily-spin-popup'

/**
 * Mount once near the root of the app. Pops the daily-spin overlay every time
 * the user lands on the homepage (`/`). Dismissing or claiming closes it for
 * the current visit; navigating away from `/` and back will re-trigger it.
 */
export function DailySpinTrigger() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Only trigger on the homepage.
    if (pathname !== '/') {
      setOpen(false)
      return
    }

    // Small delay so the page paints first and the overlay feels intentional.
    const t = window.setTimeout(() => setOpen(true), 700)
    return () => window.clearTimeout(t)
  }, [pathname])

  return (
    <DailySpinPopup
      visible={open}
      onClose={() => setOpen(false)}
      onClaim={() => setOpen(false)}
    />
  )
}

export default DailySpinTrigger
