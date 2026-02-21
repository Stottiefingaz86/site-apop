import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Device / Browser Detection ────────────────────────────

export interface DeviceInfo {
  browser: string
  os: string
  device: 'mobile' | 'tablet' | 'desktop'
  screenWidth: number
  screenHeight: number
  userAgent: string
}

function detectDevice(): DeviceInfo {
  if (typeof window === 'undefined') {
    return { browser: 'unknown', os: 'unknown', device: 'desktop', screenWidth: 0, screenHeight: 0, userAgent: '' }
  }
  const ua = navigator.userAgent
  const hasTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window
  const sw = window.screen.width
  const sh = window.screen.height
  const minDim = Math.min(sw, sh)

  // ─── Browser detection ───
  let browser = 'unknown'
  // Use modern UA Client Hints if available
  const uaData = (navigator as unknown as Record<string, unknown>).userAgentData as { brands?: { brand: string }[]; mobile?: boolean; platform?: string } | undefined
  if (uaData?.brands) {
    const brandNames = uaData.brands.map((b) => b.brand.toLowerCase())
    if (brandNames.some((b) => b.includes('firefox'))) browser = 'Firefox'
    else if (brandNames.some((b) => b.includes('edge') || b.includes('edg'))) browser = 'Edge'
    else if (brandNames.some((b) => b.includes('opera') || b.includes('opr'))) browser = 'Opera'
    else if (brandNames.some((b) => b.includes('samsung'))) browser = 'Samsung Internet'
    else if (brandNames.some((b) => b.includes('brave'))) browser = 'Brave'
    else if (brandNames.some((b) => b.includes('chrome') || b.includes('chromium'))) browser = 'Chrome'
  }
  if (browser === 'unknown') {
    // Fallback to UA string parsing
    if (/CriOS/i.test(ua)) browser = 'Chrome (iOS)'
    else if (/FxiOS/i.test(ua)) browser = 'Firefox (iOS)'
    else if (/EdgiOS/i.test(ua)) browser = 'Edge (iOS)'
    else if (ua.includes('Firefox/')) browser = 'Firefox'
    else if (ua.includes('Edg/')) browser = 'Edge'
    else if (ua.includes('OPR/') || ua.includes('Opera')) browser = 'Opera'
    else if (ua.includes('SamsungBrowser/')) browser = 'Samsung Internet'
    else if (ua.includes('Chrome/') && !ua.includes('Edg/')) browser = 'Chrome'
    else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari'
  }

  // ─── OS detection ───
  let os = 'unknown'
  if (uaData?.platform) {
    const p = uaData.platform.toLowerCase()
    if (p === 'ios') os = 'iOS'
    else if (p === 'android') os = 'Android'
    else if (p === 'windows') os = 'Windows'
    else if (p === 'macos' || p === 'mac os x') os = 'macOS'
    else if (p === 'linux') os = 'Linux'
    else if (p === 'chromeos' || p === 'chrome os') os = 'ChromeOS'
    else os = p
  }
  if (os === 'unknown') {
    if (ua.includes('iPhone') || ua.includes('iPad') || ua.includes('iPod')) os = 'iOS'
    else if (ua.includes('Android')) os = 'Android'
    else if (ua.includes('Windows')) os = 'Windows'
    else if (ua.includes('CrOS')) os = 'ChromeOS'
    else if (ua.includes('Mac OS') || ua.includes('Macintosh')) os = 'macOS'
    else if (ua.includes('Linux')) os = 'Linux'
  }

  // ─── Device type detection ───
  // iPadOS 13+ sends macOS user agent — detect via touch + screen size
  let device: 'mobile' | 'tablet' | 'desktop' = 'desktop'

  // Check UA Client Hints first (most reliable on supported browsers)
  if (uaData?.mobile === true) {
    device = 'mobile'
  } else if (uaData?.mobile === false && hasTouch) {
    // Touch-capable non-mobile hint = likely tablet
    device = minDim >= 600 ? 'tablet' : 'mobile'
  }

  // Fallback to UA string + heuristics
  if (device === 'desktop') {
    if (/iPhone|iPod/i.test(ua)) {
      device = 'mobile'
    } else if (/iPad/i.test(ua)) {
      device = 'tablet'
    } else if (/Android/i.test(ua)) {
      device = /Mobile/i.test(ua) ? 'mobile' : 'tablet'
    } else if (hasTouch && os === 'macOS' && navigator.maxTouchPoints > 1) {
      // iPadOS 13+ masquerades as macOS Safari — detect via touch support
      device = 'tablet'
      os = 'iPadOS'
    } else if (hasTouch && minDim < 600) {
      device = 'mobile'
    } else if (hasTouch && minDim < 1024) {
      device = 'tablet'
    }
  }

  return {
    browser,
    os,
    device,
    screenWidth: sw,
    screenHeight: sh,
    userAgent: ua,
  }
}

// Stable session ID (persists for browser tab lifetime — sessionStorage)
let _sessionId: string | null = null
function getSessionId(): string {
  if (!_sessionId) {
    _sessionId = typeof window !== 'undefined'
      ? (sessionStorage.getItem('tracking_session_id') || (() => {
          const id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
          sessionStorage.setItem('tracking_session_id', id)
          return id
        })())
      : 'server'
  }
  return _sessionId
}

// Persistent user ID (survives across sessions — localStorage)
let _userId: string | null = null
function getUserId(): string {
  if (!_userId) {
    _userId = typeof window !== 'undefined'
      ? (localStorage.getItem('tracking_user_id') || (() => {
          const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
          localStorage.setItem('tracking_user_id', id)
          return id
        })())
      : 'anonymous'
  }
  return _userId
}

// ─── Types ───────────────────────────────────────────────

export interface TrackingEvent {
  /** Unique event id */
  id: string
  /** Timestamp ISO string */
  ts: string
  /** Event type */
  type: 'page_view' | 'nav_click' | 'action' | 'sidebar_click' | 'cta_click'
  /** Which page the user was on when the event fired */
  page: string
  /** Target — the page/section/element they interacted with */
  target: string
  /** Optional label for the element (button text, menu item, etc.) */
  label?: string
  /** Optional extra metadata */
  meta?: Record<string, string | number | boolean>
  /** Session ID for grouping events */
  sessionId?: string
  /** Persistent user ID (survives across sessions) */
  userId?: string
  /** Device info snapshot */
  deviceInfo?: DeviceInfo
}

export interface FlowEdge {
  from: string
  to: string
  count: number
}

export interface PageStat {
  page: string
  views: number
  firstSeen: string
  lastSeen: string
}

/** A saved snapshot of the flow state at a point in time */
export interface FlowSnapshot {
  id: string
  name: string
  savedAt: string
  totalEvents: number
  pageStats: PageStat[]
  flowEdges: FlowEdge[]
  topActions: { label: string; count: number; type: string }[]
  sessionFlows: string[][]
}

/** Date range preset for filtering events */
export type DateRange = 'all' | 'today' | 'yesterday' | 'last-7d' | 'last-30d' | 'last-1h' | 'custom'

export interface DateRangeFilter {
  range: DateRange
  /** Only used when range === 'custom' */
  from?: string
  to?: string
}

/** Compute the start timestamp for a given date range preset */
export function getDateRangeStart(range: DateRange, customFrom?: string): number {
  const now = new Date()
  switch (range) {
    case 'last-1h':
      return now.getTime() - 60 * 60 * 1000
    case 'today': {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      return start.getTime()
    }
    case 'yesterday': {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
      return start.getTime()
    }
    case 'last-7d':
      return now.getTime() - 7 * 24 * 60 * 60 * 1000
    case 'last-30d':
      return now.getTime() - 30 * 24 * 60 * 60 * 1000
    case 'custom':
      return customFrom ? new Date(customFrom).getTime() : 0
    case 'all':
    default:
      return 0
  }
}

export function getDateRangeEnd(range: DateRange, customTo?: string): number {
  if (range === 'yesterday') {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  }
  if (range === 'custom' && customTo) {
    return new Date(customTo).getTime()
  }
  return Date.now() + 1000 // slight future to include "now"
}

export function filterEventsByDateRange(events: TrackingEvent[], filter: DateRangeFilter): TrackingEvent[] {
  if (filter.range === 'all') return events
  const start = getDateRangeStart(filter.range, filter.from)
  const end = getDateRangeEnd(filter.range, filter.to)
  return events.filter((e) => {
    const t = new Date(e.ts).getTime()
    return t >= start && t < end
  })
}

/** Helper: compute page stats from a subset of events */
export function computePageStats(events: TrackingEvent[]): PageStat[] {
  const filtered = events.filter((e) => e.type === 'page_view')
  const map = new Map<string, PageStat>()
  for (const e of filtered) {
    const existing = map.get(e.target)
    if (existing) {
      existing.views++
      existing.lastSeen = e.ts
    } else {
      map.set(e.target, { page: e.target, views: 1, firstSeen: e.ts, lastSeen: e.ts })
    }
  }
  return Array.from(map.values()).sort((a, b) => b.views - a.views)
}

/** Helper: compute flow edges from a subset of events */
export function computeFlowEdges(events: TrackingEvent[]): FlowEdge[] {
  const pageViews = events.filter((e) => e.type === 'page_view')
  const edgeMap = new Map<string, number>()
  for (let i = 1; i < pageViews.length; i++) {
    const from = pageViews[i - 1].target
    const to = pageViews[i].target
    if (from === to) continue
    const timeDiff = new Date(pageViews[i].ts).getTime() - new Date(pageViews[i - 1].ts).getTime()
    if (timeDiff > 5 * 60 * 1000) continue
    const key = `${from}→${to}`
    edgeMap.set(key, (edgeMap.get(key) || 0) + 1)
  }
  return Array.from(edgeMap.entries())
    .map(([key, count]) => { const [from, to] = key.split('→'); return { from, to, count } })
    .sort((a, b) => b.count - a.count)
}

/** Helper: compute top actions from a subset of events */
export function computeTopActions(events: TrackingEvent[]): { label: string; count: number; type: string }[] {
  const actionEvents = events.filter(
    (e) => e.type === 'nav_click' || e.type === 'action' || e.type === 'sidebar_click' || e.type === 'cta_click'
  )
  const map = new Map<string, { count: number; type: string }>()
  for (const e of actionEvents) {
    const key = e.label || e.target
    const existing = map.get(key)
    if (existing) existing.count++
    else map.set(key, { count: 1, type: e.type })
  }
  return Array.from(map.entries())
    .map(([label, { count, type }]) => ({ label, count, type }))
    .sort((a, b) => b.count - a.count)
}

/** Helper: compute session flows from a subset of events */
export function computeSessionFlows(events: TrackingEvent[]): string[][] {
  const pageViews = events.filter((e) => e.type === 'page_view')
  if (pageViews.length === 0) return []
  const sessions: string[][] = [[]]
  let lastTime = new Date(pageViews[0].ts).getTime()
  for (const e of pageViews) {
    const t = new Date(e.ts).getTime()
    if (t - lastTime > 5 * 60 * 1000) sessions.push([])
    const currentSession = sessions[sessions.length - 1]
    if (currentSession[currentSession.length - 1] !== e.target) currentSession.push(e.target)
    lastTime = t
  }
  return sessions.filter((s) => s.length > 1)
}

interface TrackingState {
  /** All raw events (capped at 5000) */
  events: TrackingEvent[]
  /** Whether tracking is active */
  isTracking: boolean
  /** Saved historical snapshots */
  snapshots: FlowSnapshot[]

  // ── Actions ─────────────────────────────────────────
  track: (event: Omit<TrackingEvent, 'id' | 'ts' | 'sessionId' | 'userId' | 'deviceInfo'>) => void
  setTracking: (on: boolean) => void
  clearEvents: () => void
  mergeRemoteEvents: (remoteEvents: TrackingEvent[]) => void

  // ── Snapshot actions ────────────────────────────────
  saveSnapshot: (name: string) => void
  deleteSnapshot: (id: string) => void
  renameSnapshot: (id: string, name: string) => void

  // ── Computed helpers (called from components) ───────
  getPageStats: () => PageStat[]
  getFlowEdges: () => FlowEdge[]
  getTopActions: () => { label: string; count: number; type: string }[]
  getClickHeatmap: () => { target: string; count: number; page: string }[]
  getSessionFlows: () => string[][]
  getEventsByPage: (page: string) => TrackingEvent[]
  getEventsByType: (type: TrackingEvent['type']) => TrackingEvent[]
  getTimelineByHour: () => { hour: string; count: number }[]

  // ── Behavioral insights ────────────────────────────
  /** After a user does X action/visits X page, where do they go next? */
  getPostActionFunnel: (actionOrPage: string) => { target: string; count: number; pct: number }[]
  /** For each page, what % of users who visit it also visit another page (in the same session)? */
  getCrossProductBehavior: () => { pageA: string; pageB: string; sessions: number; pctOfA: number; pctOfB: number }[]
  /** How many actions does a user take on a page before leaving? */
  getPageStickiness: () => { page: string; avgActions: number; avgTimeMs: number; bounceRate: number }[]
  /** Auto-generated text insights from the data */
  getAutoInsights: () => { id: string; text: string; type: 'info' | 'positive' | 'warning' | 'neutral'; metric?: string; sentiment: 'good' | 'bad' | 'neutral' | 'opportunity'; recommendation?: string; severity?: 'high' | 'medium' | 'low' }[]
  /** Drop-off: from a starting page, what % of users reach each subsequent page? */
  getFunnelDropoff: (startPage: string) => { page: string; reached: number; pct: number }[]

  // ── Frustration detection (like Hotjar) ───────────
  /** Detect rage clicks — rapid repeated clicks on the same target within a short window */
  getRageClicks: () => { target: string; page: string; count: number; timestamps: string[]; severity: 'mild' | 'moderate' | 'extreme' }[]
  /** Detect navigation loops — user going back and forth between pages repeatedly */
  getNavigationLoops: () => { pages: string[]; occurrences: number; avgLoopLength: number }[]
  /** Detect dead clicks — clicks that don't lead to any navigation or meaningful action */
  getDeadClicks: () => { target: string; page: string; count: number }[]
  /** Detect u-turns — user navigates to a page then immediately goes back */
  getUTurns: () => { from: string; to: string; count: number; pctOfTraffic: number }[]
  /** Overall frustration score 0-100 per page, with element-level detail */
  getFrustrationScores: () => {
    page: string; score: number; rageClicks: number; loops: number; deadClicks: number; uTurns: number; label: 'happy' | 'neutral' | 'frustrated' | 'rage'
    rageClickDetails: { target: string; count: number; severity: 'mild' | 'moderate' | 'extreme' }[]
    deadClickDetails: { target: string; count: number }[]
    uTurnDetails: { from: string; to: string; count: number }[]
    loopDetails: { pages: string[]; occurrences: number }[]
  }[]

  // ── Device & Session analytics ──────────────────────
  /** Breakdown of browsers, devices, and OS across sessions */
  getDeviceStats: () => { browsers: { name: string; count: number; pct: number }[]; devices: { name: string; count: number; pct: number }[]; os: { name: string; count: number; pct: number }[]; screens: { resolution: string; count: number }[] }
  /** Per-session details: pages visited, device, duration, event count */
  getSessionDetails: () => { sessionId: string; device: DeviceInfo | null; eventCount: number; pages: string[]; startTime: string; endTime: string; durationMs: number }[]

  // ── User analytics ──────────────────────────────────
  /** Get unique user overview: list of users with their sessions, pages, device, etc. */
  getUserOverview: () => {
    totalUniqueUsers: number
    users: {
      userId: string
      sessionCount: number
      totalEvents: number
      totalPageViews: number
      pagesVisited: string[]
      topPages: { page: string; views: number }[]
      device: DeviceInfo | null
      firstSeen: string
      lastSeen: string
      lastPage: string
      sessionFlows: string[][]
    }[]
  }
}

const MAX_EVENTS = 5000
const MAX_SNAPSHOTS = 20

let eventCounter = 0

// ── Production Event Batching (Supabase) ──────────────────────────────
// Events are stored locally in localStorage (fast, offline-capable) AND
// batched to Supabase every 5 seconds for persistent, multi-user analytics.
//
// The batch uses the Supabase client directly (no API round-trip needed).
// Set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY to enable.

let eventBatch: TrackingEvent[] = []
let batchTimer: ReturnType<typeof setTimeout> | null = null
const BATCH_INTERVAL = 5000 // 5 seconds
const BATCH_SIZE = 50

async function flushEventBatch() {
  if (eventBatch.length === 0) return
  const toSend = [...eventBatch]
  eventBatch = []
  if (batchTimer) { clearTimeout(batchTimer); batchTimer = null }

  try {
    // Dynamic import to avoid SSR issues with Supabase
    const { insertTrackingEvents } = await import('@/lib/supabase/tracking')
    const result = await insertTrackingEvents(toSend)
    if (!result.success) {
      // On failure, push events back for next batch
      eventBatch.unshift(...toSend)
    }
  } catch {
    // Supabase not configured or network error — events stay in localStorage
    eventBatch.unshift(...toSend)
  }
}

function queueEvent(event: TrackingEvent) {
  eventBatch.push(event)
  if (eventBatch.length >= BATCH_SIZE) {
    flushEventBatch()
  } else if (!batchTimer) {
    batchTimer = setTimeout(flushEventBatch, BATCH_INTERVAL)
  }
}

// Flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushEventBatch()
  })
  window.addEventListener('beforeunload', () => flushEventBatch())
}

export const useTrackingStore = create<TrackingState>()(
  persist(
    (set, get) => ({
      events: [],
      isTracking: true,
      snapshots: [],

      track: (event) => {
        if (!get().isTracking) return
        const newEvent: TrackingEvent = {
          ...event,
          id: `evt_${Date.now()}_${++eventCounter}`,
          ts: new Date().toISOString(),
          sessionId: getSessionId(),
          userId: getUserId(),
          deviceInfo: detectDevice(),
        }
        // Store locally (localStorage via zustand persist)
        set((state) => {
          const events = [...state.events, newEvent]
          return { events: events.length > MAX_EVENTS ? events.slice(-MAX_EVENTS) : events }
        })
        // Queue for server-side delivery (if API configured)
        queueEvent(newEvent)
      },

      setTracking: (on) => set({ isTracking: on }),

      clearEvents: () => set({ events: [] }),

      /** Merge remote events from Supabase (deduplicates by id) */
      mergeRemoteEvents: (remoteEvents) => {
        set((state) => {
          const existingIds = new Set(state.events.map((e) => e.id))
          const newEvents = remoteEvents.filter((e) => !existingIds.has(e.id))
          if (newEvents.length === 0) return state
          const merged = [...state.events, ...newEvents].sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime())
          return { events: merged.length > MAX_EVENTS ? merged.slice(-MAX_EVENTS) : merged }
        })
      },

      // ── Snapshot: save current flow state ──────────
      saveSnapshot: (name) => {
        const state = get()
        const snapshot: FlowSnapshot = {
          id: `snap_${Date.now()}`,
          name,
          savedAt: new Date().toISOString(),
          totalEvents: state.events.length,
          pageStats: state.getPageStats(),
          flowEdges: state.getFlowEdges(),
          topActions: state.getTopActions(),
          sessionFlows: state.getSessionFlows(),
        }
        set((s) => {
          const snapshots = [snapshot, ...s.snapshots]
          return { snapshots: snapshots.length > MAX_SNAPSHOTS ? snapshots.slice(0, MAX_SNAPSHOTS) : snapshots }
        })
      },

      deleteSnapshot: (id) => {
        set((s) => ({ snapshots: s.snapshots.filter((snap) => snap.id !== id) }))
      },

      renameSnapshot: (id, name) => {
        set((s) => ({
          snapshots: s.snapshots.map((snap) => (snap.id === id ? { ...snap, name } : snap)),
        }))
      },

      // ── Computed: page view stats ──────────────────
      getPageStats: () => {
        const events = get().events.filter((e) => e.type === 'page_view')
        const map = new Map<string, PageStat>()
        for (const e of events) {
          const existing = map.get(e.target)
          if (existing) {
            existing.views++
            existing.lastSeen = e.ts
          } else {
            map.set(e.target, {
              page: e.target,
              views: 1,
              firstSeen: e.ts,
              lastSeen: e.ts,
            })
          }
        }
        return Array.from(map.values()).sort((a, b) => b.views - a.views)
      },

      // ── Computed: flow edges (from → to) ───────────
      getFlowEdges: () => {
        const pageViews = get().events.filter((e) => e.type === 'page_view')
        const edgeMap = new Map<string, number>()
        for (let i = 1; i < pageViews.length; i++) {
          const from = pageViews[i - 1].target
          const to = pageViews[i].target
          if (from === to) continue
          const timeDiff = new Date(pageViews[i].ts).getTime() - new Date(pageViews[i - 1].ts).getTime()
          if (timeDiff > 5 * 60 * 1000) continue
          const key = `${from}→${to}`
          edgeMap.set(key, (edgeMap.get(key) || 0) + 1)
        }
        return Array.from(edgeMap.entries())
          .map(([key, count]) => {
            const [from, to] = key.split('→')
            return { from, to, count }
          })
          .sort((a, b) => b.count - a.count)
      },

      // ── Computed: top actions ──────────────────────
      getTopActions: () => {
        const actionEvents = get().events.filter(
          (e) => e.type === 'nav_click' || e.type === 'action' || e.type === 'sidebar_click' || e.type === 'cta_click'
        )
        const map = new Map<string, { count: number; type: string }>()
        for (const e of actionEvents) {
          const key = e.label || e.target
          const existing = map.get(key)
          if (existing) {
            existing.count++
          } else {
            map.set(key, { count: 1, type: e.type })
          }
        }
        return Array.from(map.entries())
          .map(([label, { count, type }]) => ({ label, count, type }))
          .sort((a, b) => b.count - a.count)
      },

      // ── Computed: click heatmap ────────────────────
      getClickHeatmap: () => {
        const clicks = get().events.filter((e) => e.type !== 'page_view')
        const map = new Map<string, { count: number; page: string }>()
        for (const e of clicks) {
          const key = `${e.page}:${e.target}`
          const existing = map.get(key)
          if (existing) {
            existing.count++
          } else {
            map.set(key, { count: 1, page: e.page })
          }
        }
        return Array.from(map.entries())
          .map(([key, { count, page }]) => ({ target: key.split(':')[1], count, page }))
          .sort((a, b) => b.count - a.count)
      },

      // ── Computed: session flows (sequences of pages) ──
      getSessionFlows: () => {
        const pageViews = get().events.filter((e) => e.type === 'page_view')
        if (pageViews.length === 0) return []
        const sessions: string[][] = [[]]
        let lastTime = new Date(pageViews[0].ts).getTime()
        for (const e of pageViews) {
          const t = new Date(e.ts).getTime()
          if (t - lastTime > 5 * 60 * 1000) {
            sessions.push([])
          }
          const currentSession = sessions[sessions.length - 1]
          if (currentSession[currentSession.length - 1] !== e.target) {
            currentSession.push(e.target)
          }
          lastTime = t
        }
        return sessions.filter((s) => s.length > 1)
      },

      // ── Get events for a specific page ─────────────
      getEventsByPage: (page) => {
        return get().events.filter((e) => e.page === page)
      },

      // ── Get events by type ─────────────────────────
      getEventsByType: (type) => {
        return get().events.filter((e) => e.type === type)
      },

      // ── Timeline: events per hour ──────────────────
      getTimelineByHour: () => {
        const events = get().events
        const map = new Map<string, number>()
        for (const e of events) {
          const d = new Date(e.ts)
          const key = `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:00`
          map.set(key, (map.get(key) || 0) + 1)
        }
        return Array.from(map.entries())
          .map(([hour, count]) => ({ hour, count }))
          .sort((a, b) => a.hour.localeCompare(b.hour))
      },

      // ── Post-action funnel: after X, where do users go? ──
      getPostActionFunnel: (actionOrPage) => {
        const events = get().events
        const targets: string[] = []
        for (let i = 0; i < events.length; i++) {
          const e = events[i]
          const isMatch =
            e.target === actionOrPage ||
            e.page === actionOrPage ||
            e.label === actionOrPage
          if (!isMatch) continue
          // Find next page_view or nav_click after this event
          for (let j = i + 1; j < events.length; j++) {
            const next = events[j]
            const timeDiff = new Date(next.ts).getTime() - new Date(e.ts).getTime()
            if (timeDiff > 5 * 60 * 1000) break
            if (next.type === 'page_view' && next.target !== actionOrPage) {
              targets.push(next.target)
              break
            }
            if (next.type === 'nav_click') {
              targets.push(next.target)
              break
            }
          }
        }
        const total = targets.length
        if (total === 0) return []
        const map = new Map<string, number>()
        for (const t of targets) {
          map.set(t, (map.get(t) || 0) + 1)
        }
        return Array.from(map.entries())
          .map(([target, count]) => ({ target, count, pct: Math.round((count / total) * 100) }))
          .sort((a, b) => b.count - a.count)
      },

      // ── Cross-product: users who visit A also visit B ──
      getCrossProductBehavior: () => {
        const sessions = get().getSessionFlows()
        if (sessions.length === 0) return []
        const pageSessionCount = new Map<string, number>()
        const pairCount = new Map<string, number>()
        for (const session of sessions) {
          const uniquePages = [...new Set(session)]
          for (const p of uniquePages) {
            pageSessionCount.set(p, (pageSessionCount.get(p) || 0) + 1)
          }
          for (let i = 0; i < uniquePages.length; i++) {
            for (let j = i + 1; j < uniquePages.length; j++) {
              const key = [uniquePages[i], uniquePages[j]].sort().join('\u2194')
              pairCount.set(key, (pairCount.get(key) || 0) + 1)
            }
          }
        }
        return Array.from(pairCount.entries())
          .map(([key, count]) => {
            const [pageA, pageB] = key.split('\u2194')
            const aTotal = pageSessionCount.get(pageA) || 1
            const bTotal = pageSessionCount.get(pageB) || 1
            return {
              pageA,
              pageB,
              sessions: count,
              pctOfA: Math.round((count / aTotal) * 100),
              pctOfB: Math.round((count / bTotal) * 100),
            }
          })
          .sort((a, b) => b.sessions - a.sessions)
      },

      // ── Page stickiness: avg actions before leaving ──
      getPageStickiness: () => {
        const events = get().events
        const pageData = new Map<string, { actionCounts: number[]; durations: number[]; bounces: number; visits: number }>()
        let currentPage: string | null = null
        let actionsOnPage = 0
        let pageEnteredAt = 0

        for (const e of events) {
          if (e.type === 'page_view') {
            if (currentPage) {
              const data = pageData.get(currentPage) || { actionCounts: [], durations: [], bounces: 0, visits: 0 }
              data.actionCounts.push(actionsOnPage)
              data.durations.push(new Date(e.ts).getTime() - pageEnteredAt)
              if (actionsOnPage === 0) data.bounces++
              data.visits++
              pageData.set(currentPage, data)
            }
            currentPage = e.target
            actionsOnPage = 0
            pageEnteredAt = new Date(e.ts).getTime()
          } else if (currentPage) {
            actionsOnPage++
          }
        }
        if (currentPage) {
          const data = pageData.get(currentPage) || { actionCounts: [], durations: [], bounces: 0, visits: 0 }
          data.actionCounts.push(actionsOnPage)
          data.durations.push(Date.now() - pageEnteredAt)
          if (actionsOnPage === 0) data.bounces++
          data.visits++
          pageData.set(currentPage, data)
        }

        return Array.from(pageData.entries())
          .map(([page, data]) => ({
            page,
            avgActions: data.actionCounts.length > 0
              ? Math.round((data.actionCounts.reduce((a, b) => a + b, 0) / data.actionCounts.length) * 10) / 10
              : 0,
            avgTimeMs: data.durations.length > 0
              ? Math.round(data.durations.reduce((a, b) => a + b, 0) / data.durations.length)
              : 0,
            bounceRate: data.visits > 0 ? Math.round((data.bounces / data.visits) * 100) : 0,
          }))
          .sort((a, b) => b.avgActions - a.avgActions)
      },

      // ── Auto-generated insights ──────────────────────
      getAutoInsights: () => {
        type Insight = { id: string; text: string; type: 'info' | 'positive' | 'warning' | 'neutral'; metric?: string; sentiment: 'good' | 'bad' | 'neutral' | 'opportunity'; recommendation?: string; severity?: 'high' | 'medium' | 'low' }
        const state = get()
        const insights: Insight[] = []
        const pageStats = state.getPageStats()
        const flowEdges = state.getFlowEdges()
        const sessions = state.getSessionFlows()
        const stickiness = state.getPageStickiness()
        const crossProduct = state.getCrossProductBehavior()

        if (pageStats.length === 0) return [{ id: 'empty', text: 'No data yet. Browse the site to start tracking user journeys.', type: 'neutral' as const, sentiment: 'neutral' as const }]

        // Most visited page
        if (pageStats.length > 0) {
          const top = pageStats[0]
          const secondViews = pageStats[1]?.views || 0
          const dominance = secondViews > 0 ? Math.round((top.views / (top.views + secondViews)) * 100) : 100
          insights.push({
            id: 'most-visited',
            text: `${top.page} is the most visited page with ${top.views} views${dominance > 70 ? ' — it dominates traffic heavily' : ''}.`,
            type: 'info',
            metric: `${top.views} views`,
            sentiment: dominance > 80 ? 'opportunity' : 'neutral',
            recommendation: dominance > 70
              ? `Other products are under-discovered. Consider promoting them from the ${top.page} page via banners, cross-sell widgets, or contextual prompts.`
              : `Traffic is well distributed across products. Keep monitoring for shifts.`,
            severity: dominance > 80 ? 'medium' : 'low',
          })
        }

        // Top flow
        if (flowEdges.length > 0) {
          const top = flowEdges[0]
          const totalFlows = flowEdges.reduce((s, e) => s + e.count, 0)
          const pct = totalFlows > 0 ? Math.round((top.count / totalFlows) * 100) : 0
          insights.push({
            id: 'top-flow',
            text: `Most common path: ${top.from} → ${top.to} (${top.count} transitions, ${pct}% of all traffic).`,
            type: 'info',
            metric: `${pct}%`,
            sentiment: 'neutral',
            recommendation: `This is your strongest user habit. Ensure this path is seamless — fast loads, no friction, clear CTA. If this is a desired path, great. If not, consider what's pulling users this way.`,
            severity: 'low',
          })
        }

        // Post-deposit behavior
        const postDeposit = state.getPostActionFunnel('deposit')
        if (postDeposit.length > 0) {
          const topDest = postDeposit[0]
          const goesToProduct = ['casino', 'sports', 'poker'].includes(topDest.target)
          insights.push({
            id: 'post-deposit',
            text: `After depositing, ${topDest.pct}% of users go to ${topDest.target}.`,
            type: goesToProduct ? 'positive' : 'warning',
            metric: `${topDest.pct}%`,
            sentiment: goesToProduct ? 'good' : 'bad',
            recommendation: goesToProduct
              ? `Great — users deposit and immediately play. This is the ideal flow. Consider showing a "Start playing" CTA after deposit to reinforce this.`
              : `Users aren't going to a product after depositing — this is a missed conversion. Add a post-deposit prompt suggesting a game or bet to start playing.`,
            severity: goesToProduct ? 'low' : 'high',
          })
        }

        // Post-VIP behavior
        const postVip = state.getPostActionFunnel('vip-hub')
        if (postVip.length > 0) {
          const topDest = postVip[0]
          const staysEngaged = ['casino', 'sports', 'poker', 'deposit'].includes(topDest.target)
          insights.push({
            id: 'post-vip',
            text: `After opening VIP Hub, ${topDest.pct}% of users go to ${topDest.target}.`,
            type: staysEngaged ? 'positive' : 'info',
            metric: `${topDest.pct}%`,
            sentiment: staysEngaged ? 'good' : 'opportunity',
            recommendation: staysEngaged
              ? `VIP Hub drives engagement — users claim rewards then go play. This is healthy behaviour.`
              : `Users are leaving after VIP Hub. Consider adding "Play Now" CTAs or bonus-linked games directly within the VIP section.`,
            severity: staysEngaged ? 'low' : 'medium',
          })
        }

        // Cross-product: casino + sports overlap
        const casinoSports = crossProduct.find(
          (c) => (c.pageA === 'casino' && c.pageB === 'sports') || (c.pageA === 'sports' && c.pageB === 'casino')
        )
        if (casinoSports) {
          const overlapPct = Math.max(casinoSports.pctOfA, casinoSports.pctOfB)
          insights.push({
            id: 'cross-casino-sports',
            text: `${casinoSports.pctOfA}% of casino visitors also visit sports in the same session.`,
            type: overlapPct > 30 ? 'positive' : 'warning',
            metric: `${casinoSports.sessions} sessions`,
            sentiment: overlapPct > 30 ? 'good' : 'opportunity',
            recommendation: overlapPct > 30
              ? `Strong cross-product engagement. Users enjoy both products — consider combo bonuses (e.g. "Bet on football, get free spins") to reinforce this.`
              : `Low cross-product usage. Most users stick to one product. Try cross-promoting with contextual banners, e.g. "While you wait for your bet, try a quick slot spin."`,
            severity: overlapPct > 30 ? 'low' : 'medium',
          })
        }

        // Stickiest page
        const stickiest = stickiness.find((s) => s.avgActions > 0)
        if (stickiest) {
          const isGood = stickiest.avgActions >= 3
          insights.push({
            id: 'stickiest',
            text: `${stickiest.page} is the stickiest page — users take ${stickiest.avgActions} actions on average before leaving.`,
            type: 'positive',
            metric: `${stickiest.avgActions} avg actions`,
            sentiment: isGood ? 'good' : 'neutral',
            recommendation: isGood
              ? `High engagement on ${stickiest.page} — this page is doing its job well. Use it as a model for improving other pages.`
              : `Moderate engagement. Consider adding more interactive elements, game previews, or quick-play options to keep users on this page longer.`,
            severity: 'low',
          })
        }

        // High bounce rate — this is a PAIN POINT
        const highBounce = stickiness.find((s) => s.bounceRate > 50 && s.avgActions <= 1)
        if (highBounce) {
          insights.push({
            id: 'high-bounce',
            text: `${highBounce.page} has a ${highBounce.bounceRate}% bounce rate — users leave without interacting. This is a pain point.`,
            type: 'warning',
            metric: `${highBounce.bounceRate}% bounce`,
            sentiment: 'bad',
            recommendation: `Critical: users land on ${highBounce.page} and immediately leave. Investigate why — is the content unclear? Loading too slow? Missing a clear call-to-action? Consider A/B testing a new layout, adding a welcome prompt, or showing personalised content.`,
            severity: 'high',
          })
        }

        // Look for more bounce pages
        const allHighBounce = stickiness.filter((s) => s.bounceRate > 40 && s.avgActions <= 2 && s.page !== highBounce?.page)
        for (const page of allHighBounce.slice(0, 2)) {
          insights.push({
            id: `bounce-${page.page}`,
            text: `${page.page} also has a high ${page.bounceRate}% bounce rate with only ${page.avgActions} actions average.`,
            type: 'warning',
            metric: `${page.bounceRate}% bounce`,
            sentiment: 'bad',
            recommendation: `Users are not engaging with ${page.page}. Review the page layout, ensure quick access to key features, and consider adding onboarding tooltips or featured content.`,
            severity: page.bounceRate > 60 ? 'high' : 'medium',
          })
        }

        // Single-product users
        const mainSections = ['casino', 'sports', 'poker']
        const singleProductSessions = sessions.filter((s) => {
          const visited = s.filter((p) => mainSections.includes(p))
          const unique = [...new Set(visited)]
          return unique.length === 1
        })
        if (sessions.length > 2 && singleProductSessions.length > 0) {
          const pct = Math.round((singleProductSessions.length / sessions.length) * 100)
          insights.push({
            id: 'single-product',
            text: `${pct}% of sessions only visit one product (casino OR sports, not both).`,
            type: pct > 70 ? 'warning' : 'info',
            metric: `${pct}%`,
            sentiment: pct > 70 ? 'bad' : 'opportunity',
            recommendation: pct > 70
              ? `Users are siloed into one product. This means lost revenue potential. Add cross-sell prompts, shared promotions, or a "Recommended for you" section to expose users to other products.`
              : `Some cross-product exploration happening. Consider loyalty incentives that reward trying different products.`,
            severity: pct > 70 ? 'high' : 'medium',
          })
        }

        // Dead-end detection — pages where users stop
        if (sessions.length > 0) {
          const lastPageCount = new Map<string, number>()
          for (const session of sessions) {
            if (session.length > 0) {
              const last = session[session.length - 1]
              lastPageCount.set(last, (lastPageCount.get(last) || 0) + 1)
            }
          }
          const sorted = Array.from(lastPageCount.entries()).sort((a, b) => b[1] - a[1])
          if (sorted.length > 0) {
            const [deadEnd, count] = sorted[0]
            const pct = Math.round((count / sessions.length) * 100)
            if (pct > 30 && !['home'].includes(deadEnd)) {
              insights.push({
                id: 'dead-end',
                text: `${pct}% of sessions end on ${deadEnd} — this is the most common exit point.`,
                type: 'warning',
                metric: `${pct}% exit here`,
                sentiment: 'bad',
                recommendation: `Users are dropping off at ${deadEnd}. Add clear next-step CTAs, suggest related content, or implement "Don't leave yet" prompts with offers to keep them engaged.`,
                severity: pct > 50 ? 'high' : 'medium',
              })
            }
          }
        }

        // Average session length
        if (sessions.length > 0) {
          const avgLen = Math.round(sessions.reduce((sum, s) => sum + s.length, 0) / sessions.length * 10) / 10
          insights.push({
            id: 'avg-session',
            text: `Average session visits ${avgLen} pages.`,
            type: avgLen > 4 ? 'positive' : avgLen > 2 ? 'info' : 'warning',
            metric: `${avgLen} pages`,
            sentiment: avgLen > 4 ? 'good' : avgLen > 2 ? 'neutral' : 'bad',
            recommendation: avgLen > 4
              ? `Healthy session depth — users are exploring the site well. This suggests good navigation and engaging content.`
              : avgLen > 2
                ? `Average engagement. Look for ways to deepen sessions — featured content carousels, "You might also like" suggestions, or time-based promotions.`
                : `Very shallow sessions — users barely explore. This is a red flag. Review site navigation, ensure the homepage effectively guides users, and consider onboarding flows for new visitors.`,
            severity: avgLen > 4 ? 'low' : avgLen > 2 ? 'medium' : 'high',
          })
        }

        // Poker discovery
        const pokerSessions = sessions.filter((s) => s.includes('poker'))
        if (sessions.length > 2) {
          const pokerPct = Math.round((pokerSessions.length / sessions.length) * 100)
          if (pokerPct < 20) {
            insights.push({
              id: 'poker-low',
              text: `Only ${pokerPct}% of sessions visit poker — it's the least discovered product.`,
              type: 'warning',
              metric: `${pokerPct}%`,
              sentiment: 'opportunity',
              recommendation: `Poker is under-exposed. Consider adding poker promotions to the homepage, cross-promoting from casino/sports, or featuring poker tournaments in the main navigation more prominently.`,
              severity: 'medium',
            })
          }
        }

        // ── Frustration-based insights ──────────────────
        const frustrationScores = state.getFrustrationScores()
        const rageClicks = state.getRageClicks()
        const navLoops = state.getNavigationLoops()
        const uTurns = state.getUTurns()

        // Rage clicks detected
        if (rageClicks.length > 0) {
          const worst = rageClicks[0]
          insights.push({
            id: 'rage-click',
            text: `Rage clicks detected on "${worst.target}" (${worst.page} page) — ${worst.count} rapid clicks. Users are clicking repeatedly expecting something to happen.`,
            type: 'warning',
            metric: `${worst.count} rage clicks`,
            sentiment: 'bad',
            recommendation: `This element may be unresponsive, too slow, or misleading. Check if the click target works correctly, add loading indicators, or make non-clickable elements visually distinct.`,
            severity: worst.severity === 'extreme' ? 'high' : worst.severity === 'moderate' ? 'high' : 'medium',
          })
        }

        // Navigation loops
        if (navLoops.length > 0) {
          const worst = navLoops[0]
          insights.push({
            id: 'nav-loop',
            text: `Navigation loop detected: users go back and forth between ${worst.pages.join(' ↔ ')} (${worst.occurrences} times). This suggests confusion or inability to find what they need.`,
            type: 'warning',
            metric: `${worst.occurrences} loops`,
            sentiment: 'bad',
            recommendation: `Users are lost between ${worst.pages.join(' and ')}. Review the navigation between these pages — are CTAs clear? Is content easy to find? Consider adding breadcrumbs or improving the information architecture.`,
            severity: worst.occurrences >= 3 ? 'high' : 'medium',
          })
        }

        // U-turns (immediate back navigation)
        if (uTurns.length > 0 && uTurns[0].count >= 2) {
          const worst = uTurns[0]
          insights.push({
            id: 'u-turn',
            text: `Frequent U-turns: users visit ${worst.to} from ${worst.from} then immediately go back (${worst.count} times). The destination page isn't meeting expectations.`,
            type: 'warning',
            metric: `${worst.count} U-turns`,
            sentiment: 'bad',
            recommendation: `Users expect something different when navigating to ${worst.to}. Either the link text/CTA is misleading, or the page content doesn't match expectations. Review the link label and the landing page content.`,
            severity: worst.count >= 4 ? 'high' : 'medium',
          })
        }

        // High frustration pages
        const frustratedPages = frustrationScores.filter((f) => f.label === 'frustrated' || f.label === 'rage')
        if (frustratedPages.length > 0) {
          const worst = frustratedPages[0]
          insights.push({
            id: 'frustrated-page',
            text: `${worst.page} has a frustration score of ${worst.score}/100 (${worst.label}). Detected: ${worst.rageClicks} rage clicks, ${worst.loops} loops, ${worst.uTurns} U-turns.`,
            type: 'warning',
            metric: `${worst.score}/100`,
            sentiment: 'bad',
            recommendation: `This page needs urgent UX attention. Investigate what's causing friction — slow interactions, confusing navigation, broken elements, or missing content. Consider user testing on this specific page.`,
            severity: 'high',
          })
        }

        // Happy pages (positive signal)
        const happyPages = frustrationScores.filter((f) => f.label === 'happy' && f.score === 0)
        if (happyPages.length > 0 && frustrationScores.length > 0) {
          insights.push({
            id: 'happy-pages',
            text: `${happyPages.length} out of ${frustrationScores.length} pages have zero frustration signals — users interact smoothly.`,
            type: 'positive',
            metric: `${happyPages.length} pages`,
            sentiment: 'good',
            recommendation: `These pages are performing well from a UX perspective. Use them as benchmarks for improving other pages.`,
            severity: 'low',
          })
        }

        // Sort by severity: high first, then medium, then low
        const severityOrder = { high: 0, medium: 1, low: 2 }
        insights.sort((a, b) => (severityOrder[a.severity || 'low'] || 2) - (severityOrder[b.severity || 'low'] || 2))

        return insights
      },

      // ── Funnel drop-off from a starting page ────────
      getFunnelDropoff: (startPage) => {
        const sessions = get().getSessionFlows()
        const relevantSessions = sessions.filter((s) => s.includes(startPage))
        if (relevantSessions.length === 0) return []
        const afterPages = new Map<string, number>()
        for (const session of relevantSessions) {
          const startIdx = session.indexOf(startPage)
          for (let i = startIdx; i < session.length; i++) {
            afterPages.set(session[i], (afterPages.get(session[i]) || 0) + 1)
          }
        }
        const total = relevantSessions.length
        return Array.from(afterPages.entries())
          .map(([page, reached]) => ({ page, reached, pct: Math.round((reached / total) * 100) }))
          .sort((a, b) => b.reached - a.reached)
      },

      // ── Frustration Detection ──────────────────────────

      getRageClicks: () => {
        const events = get().events
        const RAGE_WINDOW_MS = 2000 // 2 seconds
        const RAGE_MIN_CLICKS = 3

        // Group click events by target+page
        const clickEvents = events.filter((e) => e.type === 'cta_click' || e.type === 'action' || e.type === 'nav_click' || e.type === 'sidebar_click')
        const rageMap = new Map<string, { target: string; page: string; bursts: string[][] }>()

        for (let i = 0; i < clickEvents.length; i++) {
          const ev = clickEvents[i]
          const key = `${ev.page}::${ev.target}`

          if (!rageMap.has(key)) {
            rageMap.set(key, { target: ev.target, page: ev.page, bursts: [] })
          }

          // Look ahead for rapid clicks on same target
          const burst: string[] = [ev.ts]
          for (let j = i + 1; j < clickEvents.length; j++) {
            const next = clickEvents[j]
            if (next.page !== ev.page || next.target !== ev.target) break
            const timeDiff = new Date(next.ts).getTime() - new Date(ev.ts).getTime()
            if (timeDiff > RAGE_WINDOW_MS) break
            burst.push(next.ts)
          }

          if (burst.length >= RAGE_MIN_CLICKS) {
            rageMap.get(key)!.bursts.push(burst)
            i += burst.length - 1 // Skip past the burst
          }
        }

        return Array.from(rageMap.values())
          .filter((r) => r.bursts.length > 0)
          .map((r) => {
            const totalClicks = r.bursts.reduce((sum, b) => sum + b.length, 0)
            const allTs = r.bursts.flat()
            return {
              target: r.target,
              page: r.page,
              count: totalClicks,
              timestamps: allTs,
              severity: (totalClicks >= 10 ? 'extreme' : totalClicks >= 6 ? 'moderate' : 'mild') as 'mild' | 'moderate' | 'extreme',
            }
          })
          .sort((a, b) => b.count - a.count)
      },

      getNavigationLoops: () => {
        const events = get().events
        const pageViews = events.filter((e) => e.type === 'page_view')
        if (pageViews.length < 4) return []

        const pageSequence = pageViews.map((e) => e.target)
        const loopMap = new Map<string, { pages: string[]; occurrences: number; lengths: number[] }>()

        // Detect A→B→A→B... patterns
        for (let i = 0; i < pageSequence.length - 3; i++) {
          const a = pageSequence[i]
          const b = pageSequence[i + 1]
          if (a === b) continue // Skip duplicates

          let loopLen = 2
          let j = i + 2
          while (j < pageSequence.length - 1) {
            if (pageSequence[j] === a && pageSequence[j + 1] === b) {
              loopLen += 2
              j += 2
            } else {
              break
            }
          }

          if (loopLen >= 4) {
            const key = [a, b].sort().join('↔')
            if (!loopMap.has(key)) {
              loopMap.set(key, { pages: [a, b], occurrences: 0, lengths: [] })
            }
            const entry = loopMap.get(key)!
            entry.occurrences++
            entry.lengths.push(loopLen)
            i = j - 1 // Skip past the loop
          }
        }

        // Also detect A→B→C→A→B→C... loops (3-page cycles)
        for (let i = 0; i < pageSequence.length - 5; i++) {
          const a = pageSequence[i]
          const b = pageSequence[i + 1]
          const c = pageSequence[i + 2]
          if (a === b || b === c || a === c) continue

          let loopLen = 3
          let j = i + 3
          while (j + 2 < pageSequence.length) {
            if (pageSequence[j] === a && pageSequence[j + 1] === b && pageSequence[j + 2] === c) {
              loopLen += 3
              j += 3
            } else {
              break
            }
          }

          if (loopLen >= 6) {
            const key = [a, b, c].sort().join('↔')
            if (!loopMap.has(key)) {
              loopMap.set(key, { pages: [a, b, c], occurrences: 0, lengths: [] })
            }
            const entry = loopMap.get(key)!
            entry.occurrences++
            entry.lengths.push(loopLen)
            i = j - 1
          }
        }

        return Array.from(loopMap.values())
          .map((l) => ({
            pages: l.pages,
            occurrences: l.occurrences,
            avgLoopLength: Math.round((l.lengths.reduce((s, v) => s + v, 0) / l.lengths.length) * 10) / 10,
          }))
          .sort((a, b) => b.occurrences - a.occurrences)
      },

      getDeadClicks: () => {
        const events = get().events
        const deadMap = new Map<string, { target: string; page: string; count: number }>()

        for (let i = 0; i < events.length; i++) {
          const ev = events[i]
          if (ev.type !== 'cta_click' && ev.type !== 'action') continue

          // A click is "dead" if the next event within 3 seconds is another click on the same page
          // (meaning nothing happened — no page view, no meaningful state change)
          const next = events[i + 1]
          if (!next) continue

          const timeDiff = new Date(next.ts).getTime() - new Date(ev.ts).getTime()
          const samePageClick = next.page === ev.page && (next.type === 'cta_click' || next.type === 'action') && next.target === ev.target
          const noNavigation = next.type !== 'page_view'

          if (timeDiff < 3000 && samePageClick && noNavigation) {
            const key = `${ev.page}::${ev.target}`
            if (!deadMap.has(key)) {
              deadMap.set(key, { target: ev.target, page: ev.page, count: 0 })
            }
            deadMap.get(key)!.count++
          }
        }

        return Array.from(deadMap.values())
          .filter((d) => d.count >= 2)
          .sort((a, b) => b.count - a.count)
      },

      getUTurns: () => {
        const events = get().events
        const pageViews = events.filter((e) => e.type === 'page_view')
        if (pageViews.length < 3) return []

        const totalTransitions = Math.max(1, pageViews.length - 1)
        const uTurnMap = new Map<string, number>()

        for (let i = 0; i < pageViews.length - 2; i++) {
          const a = pageViews[i].target
          const b = pageViews[i + 1].target
          const c = pageViews[i + 2].target

          // U-turn: A → B → A (user went to B then immediately came back)
          if (a === c && a !== b) {
            const timeDiff = new Date(pageViews[i + 2].ts).getTime() - new Date(pageViews[i].ts).getTime()
            if (timeDiff < 30000) { // Within 30 seconds
              const key = `${a}→${b}`
              uTurnMap.set(key, (uTurnMap.get(key) || 0) + 1)
            }
          }
        }

        return Array.from(uTurnMap.entries())
          .map(([key, count]) => {
            const [from, to] = key.split('→')
            return { from, to, count, pctOfTraffic: Math.round((count / totalTransitions) * 100) }
          })
          .filter((u) => u.count >= 1)
          .sort((a, b) => b.count - a.count)
      },

      getFrustrationScores: () => {
        const state = get()
        const rageClicks = state.getRageClicks()
        const loops = state.getNavigationLoops()
        const deadClicks = state.getDeadClicks()
        const uTurns = state.getUTurns()
        const pageStats = state.getPageStats()

        return pageStats.map((ps) => {
          const pageRageItems = rageClicks.filter((r) => r.page === ps.page)
          const pageRage = pageRageItems.reduce((s, r) => s + r.count, 0)
          const pageLoopItems = loops.filter((l) => l.pages.includes(ps.page))
          const pageLoops = pageLoopItems.reduce((s, l) => s + l.occurrences, 0)
          const pageDeadItems = deadClicks.filter((d) => d.page === ps.page)
          const pageDead = pageDeadItems.reduce((s, d) => s + d.count, 0)
          const pageUTurnItems = uTurns.filter((u) => u.from === ps.page || u.to === ps.page)
          const pageUTurns = pageUTurnItems.reduce((s, u) => s + u.count, 0)

          // Weighted frustration score (0-100)
          const rawScore = (pageRage * 5) + (pageLoops * 10) + (pageDead * 3) + (pageUTurns * 4)
          const score = Math.min(100, Math.round(rawScore / Math.max(1, ps.views) * 10))

          const label = score >= 70 ? 'rage' : score >= 40 ? 'frustrated' : score >= 15 ? 'neutral' : 'happy'

          return {
            page: ps.page, score, rageClicks: pageRage, loops: pageLoops, deadClicks: pageDead, uTurns: pageUTurns,
            label: label as 'happy' | 'neutral' | 'frustrated' | 'rage',
            // Element-level detail
            rageClickDetails: pageRageItems.map((r) => ({ target: r.target, count: r.count, severity: r.severity })).sort((a, b) => b.count - a.count),
            deadClickDetails: pageDeadItems.map((d) => ({ target: d.target, count: d.count })).sort((a, b) => b.count - a.count),
            uTurnDetails: pageUTurnItems.map((u) => ({ from: u.from, to: u.to, count: u.count })).sort((a, b) => b.count - a.count),
            loopDetails: pageLoopItems.map((l) => ({ pages: l.pages, occurrences: l.occurrences })).sort((a, b) => b.occurrences - a.occurrences),
          }
        })
        .sort((a, b) => b.score - a.score)
      },

      // ── Device & Session analytics ──────────────────────

      getDeviceStats: () => {
        const events = get().events
        // Use one event per session to avoid overcounting
        const sessionMap = new Map<string, DeviceInfo>()
        for (const e of events) {
          if (e.sessionId && e.deviceInfo && !sessionMap.has(e.sessionId)) {
            sessionMap.set(e.sessionId, e.deviceInfo)
          }
        }
        const devices = Array.from(sessionMap.values())
        const total = devices.length || 1

        // Browser counts
        const browserMap = new Map<string, number>()
        const deviceTypeMap = new Map<string, number>()
        const osMap = new Map<string, number>()
        const screenMap = new Map<string, number>()

        for (const d of devices) {
          browserMap.set(d.browser, (browserMap.get(d.browser) || 0) + 1)
          deviceTypeMap.set(d.device, (deviceTypeMap.get(d.device) || 0) + 1)
          osMap.set(d.os, (osMap.get(d.os) || 0) + 1)
          const res = `${d.screenWidth}×${d.screenHeight}`
          screenMap.set(res, (screenMap.get(res) || 0) + 1)
        }

        const toArr = (map: Map<string, number>) =>
          Array.from(map.entries())
            .map(([name, count]) => ({ name, count, pct: Math.round((count / total) * 100) }))
            .sort((a, b) => b.count - a.count)

        return {
          browsers: toArr(browserMap),
          devices: toArr(deviceTypeMap),
          os: toArr(osMap),
          screens: Array.from(screenMap.entries())
            .map(([resolution, count]) => ({ resolution, count }))
            .sort((a, b) => b.count - a.count),
        }
      },

      getSessionDetails: () => {
        const events = get().events
        const sessionMap = new Map<string, { device: DeviceInfo | null; events: TrackingEvent[] }>()

        for (const e of events) {
          const sid = e.sessionId || 'unknown'
          if (!sessionMap.has(sid)) {
            sessionMap.set(sid, { device: e.deviceInfo || null, events: [] })
          }
          sessionMap.get(sid)!.events.push(e)
        }

        return Array.from(sessionMap.entries())
          .map(([sessionId, data]) => {
            const sorted = data.events.sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime())
            const pages = [...new Set(sorted.filter((e) => e.type === 'page_view').map((e) => e.target))]
            const startTime = sorted[0]?.ts || ''
            const endTime = sorted[sorted.length - 1]?.ts || ''
            const durationMs = startTime && endTime ? new Date(endTime).getTime() - new Date(startTime).getTime() : 0
            return {
              sessionId,
              device: data.device,
              eventCount: data.events.length,
              pages,
              startTime,
              endTime,
              durationMs,
            }
          })
          .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      },

      // ── User overview analytics ────────────────────
      getUserOverview: () => {
        const events = get().events

        // Group events by userId
        const userMap = new Map<string, TrackingEvent[]>()
        for (const e of events) {
          const uid = e.userId || 'unknown'
          if (!userMap.has(uid)) userMap.set(uid, [])
          userMap.get(uid)!.push(e)
        }

        const users = Array.from(userMap.entries()).map(([userId, userEvents]) => {
          const sorted = [...userEvents].sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime())

          // Count unique sessions
          const sessionIds = new Set(sorted.map((e) => e.sessionId).filter(Boolean))

          // Page views
          const pageViews = sorted.filter((e) => e.type === 'page_view')
          const pageCountMap = new Map<string, number>()
          for (const pv of pageViews) {
            pageCountMap.set(pv.target, (pageCountMap.get(pv.target) || 0) + 1)
          }
          const topPages = Array.from(pageCountMap.entries())
            .map(([page, views]) => ({ page, views }))
            .sort((a, b) => b.views - a.views)

          // Session flows for this user
          const sessionFlows: string[][] = [[]]
          let lastTime = pageViews.length > 0 ? new Date(pageViews[0].ts).getTime() : 0
          for (const e of pageViews) {
            const t = new Date(e.ts).getTime()
            if (t - lastTime > 5 * 60 * 1000) sessionFlows.push([])
            const current = sessionFlows[sessionFlows.length - 1]
            if (current[current.length - 1] !== e.target) current.push(e.target)
            lastTime = t
          }
          const validFlows = sessionFlows.filter((s) => s.length > 1)

          // Latest device info
          const device = sorted.find((e) => e.deviceInfo)?.deviceInfo || null

          return {
            userId,
            sessionCount: sessionIds.size,
            totalEvents: userEvents.length,
            totalPageViews: pageViews.length,
            pagesVisited: [...new Set(pageViews.map((e) => e.target))],
            topPages: topPages.slice(0, 5),
            device,
            firstSeen: sorted[0]?.ts || '',
            lastSeen: sorted[sorted.length - 1]?.ts || '',
            lastPage: pageViews.length > 0 ? pageViews[pageViews.length - 1].target : '',
            sessionFlows: validFlows,
          }
        }).sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime())

        return {
          totalUniqueUsers: users.length,
          users,
        }
      },
    }),
    {
      name: 'bol-tracking-store',
      partialize: (state) => ({
        events: state.events,
        isTracking: state.isTracking,
        snapshots: state.snapshots,
      }),
    }
  )
)
