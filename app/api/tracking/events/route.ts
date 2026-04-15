import { NextRequest, NextResponse } from 'next/server'
import { insertTrackingEvents } from '@/lib/supabase/tracking'

type ApopEventType = 'impression' | 'click'

interface ApopTrackingEventInput {
  featureId?: string
  eventType?: ApopEventType
  route?: string
  elementId?: string
}

const APOP_EVENT_TYPE_MAP: Record<ApopEventType, 'page_view' | 'cta_click'> = {
  impression: 'page_view',
  click: 'cta_click',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const inputEvents: ApopTrackingEventInput[] = Array.isArray(body?.events) ? body.events : []

    if (inputEvents.length === 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const nowIso = new Date().toISOString()

    const normalized = inputEvents
      .filter(
        (event): event is Required<Pick<ApopTrackingEventInput, 'featureId' | 'eventType'>> &
          Pick<ApopTrackingEventInput, 'route' | 'elementId'> =>
          typeof event?.featureId === 'string' &&
          (event.eventType === 'impression' || event.eventType === 'click')
      )
      .map((event, index) => ({
        id: `apop_${event.featureId}_${event.eventType}_${Date.now()}_${index}`,
        ts: nowIso,
        type: APOP_EVENT_TYPE_MAP[event.eventType],
        page: event.route ?? 'unknown',
        target: event.featureId,
        label: event.elementId ?? event.featureId,
        meta: {
          featureId: event.featureId,
          eventType: event.eventType,
          ...(event.route ? { route: event.route } : {}),
          ...(event.elementId ? { elementId: event.elementId } : {}),
          source: 'apop-tracking-events-api',
        },
      }))

    if (normalized.length === 0) {
      return NextResponse.json({ error: 'No valid events' }, { status: 400 })
    }

    const result = await insertTrackingEvents(normalized, {
      userAgent: req.headers.get('user-agent') || undefined,
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ ok: true, received: result.count })
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
}
