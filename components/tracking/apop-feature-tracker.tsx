'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const FEATURE_ID = 'cmo0gy5qw0015dd0etheq96fg'
const ELEMENT_ID_FALLBACK = 'main-nav-wallet'

type ApopEvent = {
  featureId: string
  eventType: 'impression' | 'click'
  route?: string
  elementId?: string
}

function postApopEvents(events: ApopEvent[]) {
  if (events.length === 0) return

  void fetch('/api/tracking/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events }),
    keepalive: true,
  }).catch(() => {
    // Tracking must be best-effort and never break navigation UX.
  })
}

export default function ApopFeatureTracker() {
  const pathname = usePathname()
  const sentImpressions = useRef<Set<string>>(new Set())

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(
      `[data-apop-feature-id="${FEATURE_ID}"]`
    )
    if (nodes.length === 0) return

    const impressionEvents: ApopEvent[] = []
    nodes.forEach((node, index) => {
      const elementId =
        node.dataset.apopElementId || node.id || `${ELEMENT_ID_FALLBACK}-${index + 1}`
      const key = `${pathname}:${elementId}`
      if (sentImpressions.current.has(key)) return
      sentImpressions.current.add(key)
      impressionEvents.push({
        featureId: FEATURE_ID,
        eventType: 'impression',
        route: pathname,
        elementId,
      })
    })

    postApopEvents(impressionEvents)
  }, [pathname])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return
      const root = target.closest<HTMLElement>(`[data-apop-feature-id="${FEATURE_ID}"]`)
      if (!root) return

      const elementId = root.dataset.apopElementId || root.id || ELEMENT_ID_FALLBACK
      postApopEvents([
        {
          featureId: FEATURE_ID,
          eventType: 'click',
          route: pathname,
          elementId,
        },
      ])
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [pathname])

  return null
}
