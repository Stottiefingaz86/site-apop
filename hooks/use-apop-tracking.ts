'use client'

import { useEffect, useCallback, useRef } from 'react'
import { usePathname } from 'next/navigation'

const TRACKING_ENDPOINT = '/api/tracking/events'

interface ApopEvent {
  featureId: string
  eventType: 'impression' | 'click'
  route?: string
  elementId?: string
}

function sendApopEvents(events: ApopEvent[]) {
  if (typeof window === 'undefined' || events.length === 0) return
  fetch(TRACKING_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events }),
  }).catch(() => {})
}

export function useApopTracking(featureId: string) {
  const pathname = usePathname()
  const impressionSent = useRef(false)

  useEffect(() => {
    if (impressionSent.current) return
    impressionSent.current = true
    sendApopEvents([{ featureId, eventType: 'impression', route: pathname }])
  }, [featureId, pathname])

  const trackClick = useCallback(
    (elementId?: string) => {
      sendApopEvents([{ featureId, eventType: 'click', route: pathname, elementId }])
    },
    [featureId, pathname]
  )

  return { trackClick }
}
