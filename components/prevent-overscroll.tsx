'use client'

import { useEffect, useRef } from 'react'

/**
 * Prevents the iOS rubber-band overscroll that exposes the body background
 * above fixed navigation elements on hard swipe down.
 *
 * Two-layer approach:
 * 1. CSS: globals.css sets overscroll-behavior-y: none via @media (max-width: 768px).
 *    This handles all modern mobile browsers automatically.
 * 2. JS: Intercepts pull-down touches at the top of the page as a fallback
 *    for older iOS Safari versions that don't fully support overscroll-behavior.
 *    ONLY activates on real iOS Safari — not Chrome, not Chrome DevTools responsive mode.
 */
export function PreventOverscroll() {
  const startY = useRef(0)
  const startX = useRef(0)
  const isBlocking = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Only activate JS touch handlers on real iOS Safari.
    // Chrome DevTools responsive mode simulates touch events but the non-passive
    // touch handlers can interfere with its scroll simulation.
    // The CSS overscroll-behavior-y: none (in globals.css) handles all modern browsers.
    const ua = navigator.userAgent
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    const isSafari = /Safari/.test(ua) && !/CriOS|Chrome|Chromium/.test(ua)
    
    if (!isIOS || !isSafari) return

    function isInsideScrollable(target: HTMLElement): boolean {
      return !!(
        target.closest('[data-vaul-drawer-content]') ||
        target.closest('[data-vaul-no-drag]') ||
        target.closest('[data-radix-scroll-area-viewport]') ||
        target.closest('[role="dialog"]') ||
        target.closest('.overflow-y-auto') ||
        target.closest('.overflow-auto')
      )
    }

    function onPreventBounce(e: TouchEvent) {
      if (isBlocking.current) {
        e.preventDefault()
        return
      }

      const dy = e.touches[0].pageY - startY.current
      const dx = Math.abs(e.touches[0].pageX - startX.current)

      if (Math.abs(dy) < 5 && dx < 5) return

      if (dy > 0 && dy > dx && window.scrollY <= 0) {
        isBlocking.current = true
        e.preventDefault()
      } else {
        document.removeEventListener('touchmove', onPreventBounce)
      }
    }

    function onTouchStart(e: TouchEvent) {
      startY.current = e.touches[0].pageY
      startX.current = e.touches[0].pageX
      isBlocking.current = false

      if (window.scrollY <= 0 && !isInsideScrollable(e.target as HTMLElement)) {
        document.addEventListener('touchmove', onPreventBounce, { passive: false })
      }
    }

    function onTouchEnd() {
      isBlocking.current = false
      document.removeEventListener('touchmove', onPreventBounce)
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchend', onTouchEnd, { passive: true })
    document.addEventListener('touchcancel', onTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend', onTouchEnd)
      document.removeEventListener('touchcancel', onTouchEnd)
      document.removeEventListener('touchmove', onPreventBounce)
    }
  }, [])

  return null
}
