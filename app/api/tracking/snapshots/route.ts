import { NextRequest, NextResponse } from 'next/server'
import { saveSnapshot, loadSnapshots, deleteSnapshotFromDB } from '@/lib/supabase/tracking'

// ─── GET: Load all snapshots ────────────────────────────────────────

export async function GET() {
  const snapshots = await loadSnapshots()
  return NextResponse.json({ snapshots })
}

// ─── POST: Save a new snapshot ──────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const snapshot = await req.json()
    const success = await saveSnapshot(snapshot)

    if (!success) {
      return NextResponse.json({ error: 'Failed to save snapshot' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
}

// ─── DELETE: Delete a snapshot ──────────────────────────────────────

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing snapshot id' }, { status: 400 })
  }

  const success = await deleteSnapshotFromDB(id)

  if (!success) {
    return NextResponse.json({ error: 'Failed to delete snapshot' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
