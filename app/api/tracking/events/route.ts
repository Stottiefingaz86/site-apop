import { NextRequest, NextResponse } from "next/server"

import { insertTrackingEvents } from "@/lib/supabase/tracking"
import type { TrackingEvent } from "@/lib/store/trackingStore"

type EventType = "impression" | "click"

interface IncomingEvent {
  featureId?: string
  eventType?: EventType
  route?: string
  elementId?: string
}

interface IncomingPayload {
  events?: IncomingEvent[]
}

const FEATURE_EVENT_TYPES: Record<EventType, TrackingEvent["type"]> = {
  impression: "action",
  click: "cta_click",
}

function normalizePage(route?: string): string {
  if (!route || route === "/") return "home"
  return route.replace(/^\/+/, "")
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as IncomingPayload
    const rawEvents = Array.isArray(body?.events) ? body.events : []

    if (rawEvents.length === 0) {
      return NextResponse.json({ error: "No events provided" }, { status: 400 })
    }

    const valid = rawEvents.filter(
      (event): event is Required<Pick<IncomingEvent, "featureId" | "eventType">> &
        Pick<IncomingEvent, "route" | "elementId"> =>
        typeof event?.featureId === "string" &&
        (event?.eventType === "impression" || event?.eventType === "click")
    )

    if (valid.length === 0) {
      return NextResponse.json({ error: "No valid events provided" }, { status: 400 })
    }

    const now = new Date().toISOString()
    const trackingEvents: TrackingEvent[] = valid.map((event, index) => {
      const route = event.route || "/"
      const page = normalizePage(route)
      const target = event.elementId || `feature:${event.featureId}`

      return {
        id: `evt_apop_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 8)}`,
        ts: now,
        type: FEATURE_EVENT_TYPES[event.eventType],
        page,
        target,
        label: "APOP Feature Event",
        meta: {
          featureId: event.featureId,
          eventType: event.eventType,
          route,
          ...(event.elementId ? { elementId: event.elementId } : {}),
        },
      }
    })

    const result = await insertTrackingEvents(trackingEvents, {
      userAgent: req.headers.get("user-agent") || undefined,
      ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || undefined,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to store events" }, { status: 500 })
    }

    return NextResponse.json({ ok: true, received: result.count })
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }
}
