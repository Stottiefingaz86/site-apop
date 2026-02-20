import { NextRequest, NextResponse } from 'next/server'
import { queryPageStats, queryFlowEdges, queryTopActions, querySessionFlows } from '@/lib/supabase/tracking'
import type { DateRangeFilter } from '@/lib/store/trackingStore'

// ─── GET: Pre-computed stats from Supabase ──────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const range = (searchParams.get('range') || 'all') as DateRangeFilter['range']
  const from = searchParams.get('from') || undefined
  const to = searchParams.get('to') || undefined

  const dateFilter: DateRangeFilter = { range, from, to }

  const [pageStats, flowEdges, topActions, sessionFlows] = await Promise.all([
    queryPageStats(dateFilter),
    queryFlowEdges(dateFilter),
    queryTopActions(dateFilter),
    querySessionFlows(dateFilter),
  ])

  return NextResponse.json({
    range,
    pageStats,
    flowEdges,
    topActions,
    sessionFlows,
    summary: {
      totalPageViews: pageStats.reduce((sum, p) => sum + p.views, 0),
      uniquePages: pageStats.length,
      totalTransitions: flowEdges.reduce((sum, e) => sum + e.count, 0),
      uniqueFlows: flowEdges.length,
      totalActions: topActions.reduce((sum, a) => sum + a.count, 0),
      totalSessions: sessionFlows.length,
    },
  })
}
