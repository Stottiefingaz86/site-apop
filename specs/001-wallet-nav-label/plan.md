# Implementation Plan: Change deposit to say Wallet

**Branch**: `apop/cmo0gy5qw0-mo0h04am` | **Date**: 2026-04-15 | **Spec**: `/workspace/specs/001-wallet-nav-label/spec.md`
**Input**: Feature specification from `/workspace/specs/001-wallet-nav-label/spec.md`

## Summary

Rename the broad-surface main-navigation entry label from "Deposit" to "Wallet"
without changing routing behavior, and add APOP journey tracking for impressions
and clicks under feature ID `cmo0gy5qw0015dd0etheq96fg`. Implementation extends the
existing repeated nav-button pattern in route pages and adds a shared tracking
bridge (`/api/tracking/events`) plus a global client tracker that emits events
from tagged wallet nav roots.

## Technical Context

**Language/Version**: TypeScript (Next.js App Router project)  
**Primary Dependencies**: Next.js, React, Tailwind CSS, shadcn/ui, Zustand tracking store  
**Storage**: Supabase Postgres via existing tracking persistence adapter (`insertTrackingEvents`)  
**Testing**: `npm run build` (type + production build validation)  
**Target Platform**: Web (desktop + mobile nav variants in Next.js routes)  
**Project Type**: Monolithic Next.js App Router web application  
**Performance Goals**: No measurable nav render delay or click latency regression  
**Constraints**: Preserve existing nav destination/ordering/style; no blocking on tracking failures  
**Scale/Scope**: Sitewide main-nav pattern across many route files + tracking API integration

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Next.js App Router + TypeScript first: implementation is in existing Next.js TSX routes.
- ✅ shadcn/ui + Tailwind token fidelity: existing button pattern/styles reused unchanged.
- ✅ Component-first extension: extended existing nav button pattern; no parallel nav component introduced.
- ✅ Journey map instrumentation: `data-apop-feature-id` applied to wallet nav roots, impression/click events emitted.
- ✅ Quality gates: build validation planned via `npm run build`.
- ✅ No constitution violations requiring exception handling.

## Project Structure

### Documentation (this feature)

```text
specs/001-wallet-nav-label/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── tracking-events.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── layout.tsx
├── api/
│   └── tracking/
│       └── events/
│           └── route.ts
├── page.tsx
├── account/page.tsx
├── casino/page.tsx
├── navtest/page.tsx
└── sports/**/page.tsx      # repeated route surfaces with shared nav button pattern

components/
└── tracking/
    └── apop-feature-tracker.tsx
```

**Structure Decision**: Keep existing route-level page architecture and extend the
already-shipped wallet/deposit nav button pattern in-place across affected surfaces.
Add one shared non-visual tracker component and one API bridge route to avoid per-page
custom tracking logic.

## Complexity Tracking

No constitution violations identified.
