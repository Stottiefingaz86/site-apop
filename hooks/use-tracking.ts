'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useTrackingStore } from '@/lib/store/trackingStore'

/**
 * Hook that auto-tracks a page view on mount and provides helpers
 * for tracking clicks and actions within that page.
 *
 * Usage:
 *   const { trackClick, trackAction, trackNav } = useTracking('casino')
 *   <button onClick={() => { trackClick('play-game', 'Play Game'); doSomething() }}>Play</button>
 */
export function useTracking(pageName: string) {
  const track = useTrackingStore((s) => s.track)
  const mounted = useRef(false)

  // Auto-track page view on mount
  useEffect(() => {
    if (mounted.current) return
    mounted.current = true
    track({
      type: 'page_view',
      page: pageName,
      target: pageName,
    })
  }, [pageName, track])

  // Track a navigation click (going to another page)
  const trackNav = useCallback(
    (target: string, label?: string) => {
      track({
        type: 'nav_click',
        page: pageName,
        target,
        label: label || target,
      })
    },
    [pageName, track]
  )

  // Track a general click on the page
  const trackClick = useCallback(
    (target: string, label?: string, meta?: Record<string, string | number | boolean>) => {
      track({
        type: 'cta_click',
        page: pageName,
        target,
        label: label || target,
        meta,
      })
    },
    [pageName, track]
  )

  // Track an action (place bet, deposit, claim reward, etc.)
  const trackAction = useCallback(
    (target: string, label?: string, meta?: Record<string, string | number | boolean>) => {
      track({
        type: 'action',
        page: pageName,
        target,
        label: label || target,
        meta,
      })
    },
    [pageName, track]
  )

  // Track a sidebar click
  const trackSidebar = useCallback(
    (target: string, label?: string) => {
      track({
        type: 'sidebar_click',
        page: pageName,
        target,
        label: label || target,
      })
    },
    [pageName, track]
  )

  // Track a sub-page view (e.g. Poker, VIP Rewards within Casino)
  // This fires a page_view event so it shows up in session flows / journey maps
  const trackPageView = useCallback(
    (target: string, label?: string) => {
      track({
        type: 'page_view',
        page: pageName,
        target,
        label: label || target,
      })
    },
    [pageName, track]
  )

  return { trackNav, trackClick, trackAction, trackSidebar, trackPageView }
}
