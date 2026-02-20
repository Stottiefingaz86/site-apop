-- ─── Tracking Events Schema ─────────────────────────────────────────
-- Copy this SQL and run it in the Supabase SQL Editor
-- https://supabase.com/dashboard → SQL Editor → New Query → Paste → Run
-- ─────────────────────────────────────────────────────────────────────

-- Main events table — stores every tracked interaction
CREATE TABLE IF NOT EXISTS tracking_events (
  id TEXT PRIMARY KEY,
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  type TEXT NOT NULL CHECK (type IN ('page_view', 'nav_click', 'action', 'sidebar_click', 'cta_click')),
  page TEXT NOT NULL,
  target TEXT NOT NULL,
  label TEXT,
  meta JSONB DEFAULT '{}',
  -- Server-enriched fields
  session_id TEXT,
  user_agent TEXT,
  ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes for fast querying ──────────────────────────────────────

-- Date range queries (most common): WHERE ts >= X AND ts < Y
CREATE INDEX IF NOT EXISTS idx_tracking_events_ts ON tracking_events (ts DESC);

-- Filter by type (page_view, action, etc.)
CREATE INDEX IF NOT EXISTS idx_tracking_events_type ON tracking_events (type, ts DESC);

-- Filter by page
CREATE INDEX IF NOT EXISTS idx_tracking_events_page ON tracking_events (page, ts DESC);

-- Filter by target (for flow edge computation)
CREATE INDEX IF NOT EXISTS idx_tracking_events_target ON tracking_events (target, ts DESC);

-- Session grouping
CREATE INDEX IF NOT EXISTS idx_tracking_events_session ON tracking_events (session_id, ts ASC);

-- Composite for common queries
CREATE INDEX IF NOT EXISTS idx_tracking_events_type_page ON tracking_events (type, page, ts DESC);

-- ─── Snapshots table — saved flow states for comparison ─────────────

CREATE TABLE IF NOT EXISTS tracking_snapshots (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_events INTEGER NOT NULL DEFAULT 0,
  page_stats JSONB NOT NULL DEFAULT '[]',
  flow_edges JSONB NOT NULL DEFAULT '[]',
  top_actions JSONB NOT NULL DEFAULT '[]',
  session_flows JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tracking_snapshots_saved ON tracking_snapshots (saved_at DESC);

-- ─── Materialized view: hourly page stats (for fast dashboard) ──────
-- Refresh this periodically via cron or on-demand

CREATE MATERIALIZED VIEW IF NOT EXISTS tracking_page_stats_hourly AS
SELECT
  date_trunc('hour', ts) AS hour,
  target AS page,
  type,
  COUNT(*) AS event_count,
  MIN(ts) AS first_seen,
  MAX(ts) AS last_seen
FROM tracking_events
GROUP BY date_trunc('hour', ts), target, type
ORDER BY hour DESC, event_count DESC;

CREATE UNIQUE INDEX IF NOT EXISTS idx_page_stats_hourly_unique
ON tracking_page_stats_hourly (hour, page, type);

-- ─── Materialized view: flow edges (page transitions) ───────────────

CREATE MATERIALIZED VIEW IF NOT EXISTS tracking_flow_edges_daily AS
WITH page_views AS (
  SELECT id, ts, target,
    LAG(target) OVER (ORDER BY ts) AS prev_target,
    LAG(ts) OVER (ORDER BY ts) AS prev_ts
  FROM tracking_events
  WHERE type = 'page_view'
)
SELECT
  date_trunc('day', ts) AS day,
  prev_target AS from_page,
  target AS to_page,
  COUNT(*) AS transition_count
FROM page_views
WHERE prev_target IS NOT NULL
  AND prev_target != target
  AND EXTRACT(EPOCH FROM (ts - prev_ts)) < 300  -- 5 min session gap
GROUP BY date_trunc('day', ts), prev_target, target
ORDER BY day DESC, transition_count DESC;

CREATE UNIQUE INDEX IF NOT EXISTS idx_flow_edges_daily_unique
ON tracking_flow_edges_daily (day, from_page, to_page);

-- ─── Row Level Security ─────────────────────────────────────────────
-- For now, allow all operations (internal tool).
-- In production with multi-tenant, add user-based RLS.

ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_snapshots ENABLE ROW LEVEL SECURITY;

-- Allow all reads/writes for authenticated and anon users (internal tool)
CREATE POLICY "Allow all tracking_events" ON tracking_events
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all tracking_snapshots" ON tracking_snapshots
  FOR ALL USING (true) WITH CHECK (true);

-- ─── Helper function: refresh materialized views ────────────────────

CREATE OR REPLACE FUNCTION refresh_tracking_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY tracking_page_stats_hourly;
  REFRESH MATERIALIZED VIEW CONCURRENTLY tracking_flow_edges_daily;
END;
$$ LANGUAGE plpgsql;

-- ─── Optional: Auto-refresh every 5 minutes via pg_cron ─────────────
-- Uncomment if pg_cron is enabled on your Supabase project:
--
-- SELECT cron.schedule(
--   'refresh-tracking-views',
--   '*/5 * * * *',
--   'SELECT refresh_tracking_views()'
-- );
