'use client'

import { useEffect, useRef } from 'react'

/**
 * Prevents the iOS rubber-band overscroll that exposes the body background
 * above fixed navigation elements on hard swipe down.
 *
 * Strategy:
 * - On touchstart, if the page is at the very top (scrollY ≤ 0) AND the touch
 *   is NOT inside a scrollable sub-container (drawer, modal, sidebar), attach
 *   a short-lived passive:false touchmove listener.
 * - That listener waits for the first significant finger movement (> 5px).
 *   If it's a pull-down gesture, it calls preventDefault() to block the bounce.
 *   If it's a scroll-down or horizontal gesture, it lets it through.
 * - The listener self-removes after the first decision, so it's alive for only
 *   1-3 frames per touch. Normal mid-page scrolling never has a non-passive
 *   listener at all.
 */
export function PreventOverscroll() {
  const startY = useRef(0)
  const startX = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined' || !('ontouchstart' in window)) return

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
      const dy = e.touches[0].pageY - startY.current
      const dx = Math.abs(e.touches[0].pageX - startX.current)

      // Wait until movement is significant enough to classify
      if (Math.abs(dy) < 5 && dx < 5) return

      // Pull-down at the top → block the bounce
      if (dy > 0 && dy > dx && window.scrollY <= 0) {
        e.preventDefault()
      }

      // Decision made — remove ourselves for the rest of this touch
      document.removeEventListener('touchmove', onPreventBounce)
    }

    function onTouchStart(e: TouchEvent) {
      startY.current = e.touches[0].pageY
      startX.current = e.touches[0].pageX

      // Only attach the non-passive listener when at the very top
      // AND outside any scrollable sub-container
      if (window.scrollY <= 0 && !isInsideScrollable(e.target as HTMLElement)) {
        document.addEventListener('touchmove', onPreventBounce, { passive: false })
      }
    }

    function onTouchEnd() {
      // Clean up in case the touch ended before a significant move
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
