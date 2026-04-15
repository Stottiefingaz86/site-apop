# Research: Change deposit to say Wallet

## Decision 1: Extend existing repeated nav button pattern in route pages
- **Decision**: Reuse the existing main-nav button pattern in route pages and update
  its visible label to `WALLET`, while preserving button behavior and style.
- **Rationale**: The repository does not expose a single consolidated main-nav
  component for this surface; the repeated route pattern is the current shipped UI.
  Updating this existing pattern avoids introducing a one-off parallel component.
- **Alternatives considered**:
  - Introduce a new global navigation component: rejected due to invasive refactor
    risk across many route files for a scoped copy update.
  - Patch only a subset of routes: rejected because requirement is broad-surface
    consistency for all users who see this nav pattern.

## Decision 2: Implement APOP tracking via dedicated API bridge route
- **Decision**: Add `POST /api/tracking/events` that accepts
  `{ events: [{ featureId, eventType, route?, elementId? }] }` and maps these to
  existing tracking persistence using `insertTrackingEvents`.
- **Rationale**: This keeps the required APOP payload contract while reusing the
  existing tracking data pipeline and Supabase persistence adapter.
- **Alternatives considered**:
  - Send APOP events directly to existing `/api/tracking`: rejected because required
    body contract differs and this risks breaking existing consumers.
  - Create a separate storage path: rejected because journey-map analytics already
    rely on the current tracking infrastructure.

## Decision 3: Centralize impression/click emission in a global tracker component
- **Decision**: Add a non-visual client component mounted in `app/layout.tsx` that:
  - emits impression events on route mount for elements tagged with
    `data-apop-feature-id="cmo0gy5qw0015dd0etheq96fg"`,
  - emits click events for interactions within tagged roots.
- **Rationale**: Centralized behavior avoids duplicating mount/click tracking logic in
  dozens of route files, while still supporting route-aware telemetry.
- **Alternatives considered**:
  - Per-page `useEffect` + click handlers: rejected due to high duplication and drift.
  - MutationObserver-based detection: rejected as unnecessary complexity for this scope.

