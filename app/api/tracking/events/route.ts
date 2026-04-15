import { NextRequest, NextResponse } from "next/server"

type JourneyEvent = {
  featureId: string
  eventType: "impression" | "click"
  route?: string
  elementId?: string
}

type TrackingPayload = {
  events?: JourneyEvent[]
}

function isJourneyEvent(value: unknown): value is JourneyEvent {
  if (typeof value !== "object" || value === null) return false
  const candidate = value as Record<string, unknown>

  const validType =
    candidate.eventType === "impression" || candidate.eventType === "click"
  return (
    typeof candidate.featureId === "string" &&
    candidate.featureId.length > 0 &&
    validType
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TrackingPayload
    const incoming = Array.isArray(body.events) ? body.events : []
    const events = incoming.filter(isJourneyEvent)

    if (events.length === 0) {
      return NextResponse.json(
        { error: "No valid events supplied" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      ok: true,
      received: events.length,
      events,
    })
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }
}
