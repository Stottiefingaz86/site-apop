/**
 * Supabase Tracking Client
 *
 * Handles all read/write operations for tracking events.
 * Uses the existing Supabase client from lib/supabase/client.ts.
 */

import { supabase, isSupabaseConfigured } from './client'
import type { TrackingEvent, FlowEdge, PageStat, FlowSnapshot, DateRangeFilter } from '@/lib/store/trackingStore'
import { getDateRangeStart, getDateRangeEnd } from '@/lib/store/trackingStore'

// ─── Write: Insert tracking events (batch) ──────────────────────────

export async function insertTrackingEvents(
  events: TrackingEvent[],
  extra?: { userAgent?: string; ip?: string; sessionId?: string }
): Promise<{ success: boolean; count: number; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, count: 0, error: 'Supabase not configured' }
  }

  const rows = events.map((e) => ({
    id: e.id,
    ts: e.ts,
    type: e.type,
    page: e.page,
    target: e.target,
    label: e.label || null,
    // Store deviceInfo and userId inside meta so they round-trip through Supabase
    meta: {
      ...(e.meta || {}),
      ...(e.deviceInfo ? { _deviceInfo: e.deviceInfo } : {}),
      ...(e.userId ? { _userId: e.userId } : {}),
    },
    session_id: e.sessionId || extra?.sessionId || null,
    user_agent: e.deviceInfo?.userAgent || extra?.userAgent || null,
    ip: extra?.ip || null,
  }))

  const { error } = await supabase
    .from('tracking_events')
    .upsert(rows, { onConflict: 'id', ignoreDuplicates: true })

  if (error) {
    console.error('[Tracking] Insert error:', error.message)
    return { success: false, count: 0, error: error.message }
  }

  return { success: true, count: rows.length }
}

// ─── Read: Query events with date range + filters ───────────────────

export async function queryTrackingEvents(options: {
  dateFilter?: DateRangeFilter
  page?: string
  type?: TrackingEvent['type']
  limit?: number
  offset?: number
}): Promise<{ data: TrackingEvent[]; total: number; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: [], total: 0, error: 'Supabase not configured' }
  }

  const { dateFilter, page, type, limit = 1000, offset = 0 } = options

  let query = supabase
    .from('tracking_events')
    .select('*', { count: 'exact' })
    .order('ts', { ascending: false })
    .range(offset, offset + limit - 1)

  // Date range filter
  if (dateFilter && dateFilter.range !== 'all') {
    const start = new Date(getDateRangeStart(dateFilter.range, dateFilter.from)).toISOString()
    const end = new Date(getDateRangeEnd(dateFilter.range, dateFilter.to)).toISOString()
    query = query.gte('ts', start).lt('ts', end)
  }

  if (page) query = query.eq('page', page)
  if (type) query = query.eq('type', type)

  const { data, error, count } = await query

  if (error) {
    console.error('[Tracking] Query error:', error.message)
    return { data: [], total: 0, error: error.message }
  }

  const events: TrackingEvent[] = (data || []).map((row) => {
    const meta = row.meta || {}
    const deviceInfo = meta._deviceInfo || undefined
    const userId = meta._userId || undefined
    // Remove internal fields from meta so they don't leak into display
    const { _deviceInfo, _userId, ...cleanMeta } = meta
    return {
      id: row.id,
      ts: row.ts,
      type: row.type,
      page: row.page,
      target: row.target,
      label: row.label || undefined,
      meta: Object.keys(cleanMeta).length > 0 ? cleanMeta : undefined,
      sessionId: row.session_id || undefined,
      userId,
      deviceInfo,
    }
  })

  return { data: events, total: count || 0 }
}

// ─── Read: Fetch all remote events (for journey map merge) ──────────

export async function fetchAllRemoteEvents(limit = 5000): Promise<TrackingEvent[]> {
  if (!isSupabaseConfigured() || !supabase) return []

  const { data, error } = await supabase
    .from('tracking_events')
    .select('*')
    .order('ts', { ascending: true })
    .limit(limit)

  if (error || !data) {
    console.error('[Tracking] Fetch remote events error:', error?.message)
    return []
  }

  return data.map((row) => {
    const meta = row.meta || {}
    const deviceInfo = meta._deviceInfo || undefined
    const userId = meta._userId || undefined
    const { _deviceInfo, _userId, ...cleanMeta } = meta
    return {
      id: row.id,
      ts: row.ts,
      type: row.type,
      page: row.page,
      target: row.target,
      label: row.label || undefined,
      meta: Object.keys(cleanMeta).length > 0 ? cleanMeta : undefined,
      sessionId: row.session_id || undefined,
      userId,
      deviceInfo,
    }
  })
}

// ─── Read: Get page stats (aggregated from DB) ─────────────────────

export async function queryPageStats(dateFilter?: DateRangeFilter): Promise<PageStat[]> {
  if (!isSupabaseConfigured() || !supabase) return []

  let query = supabase
    .from('tracking_events')
    .select('target, ts')
    .eq('type', 'page_view')
    .order('ts', { ascending: true })

  if (dateFilter && dateFilter.range !== 'all') {
    const start = new Date(getDateRangeStart(dateFilter.range, dateFilter.from)).toISOString()
    const end = new Date(getDateRangeEnd(dateFilter.range, dateFilter.to)).toISOString()
    query = query.gte('ts', start).lt('ts', end)
  }

  const { data, error } = await query

  if (error || !data) return []

  const map = new Map<string, PageStat>()
  for (const row of data) {
    const existing = map.get(row.target)
    if (existing) {
      existing.views++
      existing.lastSeen = row.ts
    } else {
      map.set(row.target, { page: row.target, views: 1, firstSeen: row.ts, lastSeen: row.ts })
    }
  }
  return Array.from(map.values()).sort((a, b) => b.views - a.views)
}

// ─── Read: Get flow edges (page transitions) ───────────────────────

export async function queryFlowEdges(dateFilter?: DateRangeFilter): Promise<FlowEdge[]> {
  if (!isSupabaseConfigured() || !supabase) return []

  let query = supabase
    .from('tracking_events')
    .select('target, ts')
    .eq('type', 'page_view')
    .order('ts', { ascending: true })

  if (dateFilter && dateFilter.range !== 'all') {
    const start = new Date(getDateRangeStart(dateFilter.range, dateFilter.from)).toISOString()
    const end = new Date(getDateRangeEnd(dateFilter.range, dateFilter.to)).toISOString()
    query = query.gte('ts', start).lt('ts', end)
  }

  const { data, error } = await query

  if (error || !data) return []

  const edgeMap = new Map<string, number>()
  for (let i = 1; i < data.length; i++) {
    const from = data[i - 1].target
    const to = data[i].target
    if (from === to) continue
    const timeDiff = new Date(data[i].ts).getTime() - new Date(data[i - 1].ts).getTime()
    if (timeDiff > 5 * 60 * 1000) continue
    const key = `${from}→${to}`
    edgeMap.set(key, (edgeMap.get(key) || 0) + 1)
  }

  return Array.from(edgeMap.entries())
    .map(([key, count]) => { const [from, to] = key.split('→'); return { from, to, count } })
    .sort((a, b) => b.count - a.count)
}

// ─── Read: Get top actions ──────────────────────────────────────────

export async function queryTopActions(dateFilter?: DateRangeFilter): Promise<{ label: string; count: number; type: string }[]> {
  if (!isSupabaseConfigured() || !supabase) return []

  let query = supabase
    .from('tracking_events')
    .select('type, target, label')
    .in('type', ['nav_click', 'action', 'sidebar_click', 'cta_click'])
    .order('ts', { ascending: false })

  if (dateFilter && dateFilter.range !== 'all') {
    const start = new Date(getDateRangeStart(dateFilter.range, dateFilter.from)).toISOString()
    const end = new Date(getDateRangeEnd(dateFilter.range, dateFilter.to)).toISOString()
    query = query.gte('ts', start).lt('ts', end)
  }

  const { data, error } = await query

  if (error || !data) return []

  const map = new Map<string, { count: number; type: string }>()
  for (const e of data) {
    const key = e.label || e.target
    const existing = map.get(key)
    if (existing) existing.count++
    else map.set(key, { count: 1, type: e.type })
  }
  return Array.from(map.entries())
    .map(([label, { count, type }]) => ({ label, count, type }))
    .sort((a, b) => b.count - a.count)
}

// ─── Read: Get session flows ────────────────────────────────────────

export async function querySessionFlows(dateFilter?: DateRangeFilter): Promise<string[][]> {
  if (!isSupabaseConfigured() || !supabase) return []

  let query = supabase
    .from('tracking_events')
    .select('target, ts')
    .eq('type', 'page_view')
    .order('ts', { ascending: true })

  if (dateFilter && dateFilter.range !== 'all') {
    const start = new Date(getDateRangeStart(dateFilter.range, dateFilter.from)).toISOString()
    const end = new Date(getDateRangeEnd(dateFilter.range, dateFilter.to)).toISOString()
    query = query.gte('ts', start).lt('ts', end)
  }

  const { data, error } = await query

  if (error || !data || data.length === 0) return []

  const sessions: string[][] = [[]]
  let lastTime = new Date(data[0].ts).getTime()
  for (const e of data) {
    const t = new Date(e.ts).getTime()
    if (t - lastTime > 5 * 60 * 1000) sessions.push([])
    const currentSession = sessions[sessions.length - 1]
    if (currentSession[currentSession.length - 1] !== e.target) currentSession.push(e.target)
    lastTime = t
  }
  return sessions.filter((s) => s.length > 1)
}

// ─── Snapshots: Save / Load / Delete ────────────────────────────────

export async function saveSnapshot(snapshot: FlowSnapshot): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false

  const { error } = await supabase
    .from('tracking_snapshots')
    .upsert({
      id: snapshot.id,
      name: snapshot.name,
      saved_at: snapshot.savedAt,
      total_events: snapshot.totalEvents,
      page_stats: snapshot.pageStats,
      flow_edges: snapshot.flowEdges,
      top_actions: snapshot.topActions,
      session_flows: snapshot.sessionFlows,
    })

  if (error) {
    console.error('[Tracking] Snapshot save error:', error.message)
    return false
  }
  return true
}

export async function loadSnapshots(): Promise<FlowSnapshot[]> {
  if (!isSupabaseConfigured() || !supabase) return []

  const { data, error } = await supabase
    .from('tracking_snapshots')
    .select('*')
    .order('saved_at', { ascending: false })
    .limit(20)

  if (error || !data) return []

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    savedAt: row.saved_at,
    totalEvents: row.total_events,
    pageStats: row.page_stats,
    flowEdges: row.flow_edges,
    topActions: row.top_actions,
    sessionFlows: row.session_flows,
  }))
}

export async function deleteSnapshotFromDB(id: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false

  const { error } = await supabase
    .from('tracking_snapshots')
    .delete()
    .eq('id', id)

  return !error
}

// ─── Sync: Push local events to Supabase ────────────────────────────
// Call this on app mount to sync any events stored in localStorage

export async function syncLocalEventsToSupabase(localEvents: TrackingEvent[]): Promise<number> {
  if (!isSupabaseConfigured() || !supabase || localEvents.length === 0) return 0

  // Insert in batches of 500 (Supabase row limit per request)
  const BATCH_SIZE = 500
  let synced = 0

  for (let i = 0; i < localEvents.length; i += BATCH_SIZE) {
    const batch = localEvents.slice(i, i + BATCH_SIZE)
    const result = await insertTrackingEvents(batch)
    if (result.success) synced += result.count
  }

  return synced
}
