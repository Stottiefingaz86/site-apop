import { NextRequest, NextResponse } from 'next/server'
import { insertTrackingEvents, queryTrackingEvents } from '@/lib/supabase/tracking'
import type { DateRangeFilter } from '@/lib/store/trackingStore'

// ─── POST: Receive events from the frontend ─────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const events = Array.isArray(body) ? body : [body]

    const result = await insertTrackingEvents(events, {
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

// ─── GET: Query events with date range + filters ────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const range = (searchParams.get('range') || 'all') as DateRangeFilter['range']
  const page = searchParams.get('page') || undefined
  const type = searchParams.get('type') as 'page_view' | 'nav_click' | 'action' | 'sidebar_click' | 'cta_click' | undefined
  const limit = parseInt(searchParams.get('limit') || '1000')
  const offset = parseInt(searchParams.get('offset') || '0')
  const from = searchParams.get('from') || undefined
  const to = searchParams.get('to') || undefined

  const dateFilter: DateRangeFilter = { range, from, to }

  const result = await queryTrackingEvents({ dateFilter, page, type, limit, offset })

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({
    total: result.total,
    limit,
    offset,
    range,
    data: result.data,
  })
}
