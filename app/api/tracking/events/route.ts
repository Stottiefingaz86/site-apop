import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const events = body?.events ?? (Array.isArray(body) ? body : [body])

    return NextResponse.json({ ok: true, received: events.length })
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
}
