# Implementation Plan: Change Casino to Games

**Branch**: `apop-spec/cmo19hkr60-mo19jfzu` | **Date**: 2026-04-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-casino-to-games/spec.md`

## Summary

Rename all user-facing navigation labels from "Casino" to "Games" (and "Live Casino" to "Live Games") across the main navigation header, quick-links menus, and footer sections. This is a pure text-label change affecting three page files. No routes, analytics identifiers, component APIs, or data models change.

## Technical Context

**Language/Version**: TypeScript 5.x on Next.js 15 App Router  
**Primary Dependencies**: React 18+, Tailwind CSS, shadcn/ui (SidebarMenuButton, etc.)  
**Storage**: N/A — no data model or database changes  
**Testing**: Manual visual verification (no automated test framework configured for this repo)  
**Target Platform**: Web (desktop + mobile responsive)  
**Project Type**: Web application (Next.js)  
**Performance Goals**: N/A — text-only change, no performance implications  
**Constraints**: Must not alter URL routes (`/casino`, `/casino?tab=live`, etc.) or internal tracking event keys  
**Scale/Scope**: 3 page files, ~30 string replacements total

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution is in placeholder state (no project-specific principles defined). No gates to enforce. Proceeding.

## Affected Files & Change Locations

### 1. `app/page.tsx` (Homepage)

| Line(s) | Current Text | New Text | Context |
|---------|-------------|----------|---------|
| ~2093 | `label: 'Casino'` | `label: 'Games'` | Quick-links menu |
| ~2094 | `label: 'Live Casino'` | `label: 'Live Games'` | Quick-links menu |
| ~2185–2187 | `Casino` (SidebarMenuButton child) | `Games` | Main nav header |
| ~2193–2195 | `Live Casino` (SidebarMenuButton child) | `Live Games` | Main nav header |
| ~3801 | `Casino` (footer h3) | `Games` | Footer section heading |
| ~3803 | `Play Casino` (footer link) | `Play Games` | Footer link text |

### 2. `app/navtest/page.tsx` (Nav Test Page)

| Line(s) | Current Text | New Text | Context |
|---------|-------------|----------|---------|
| ~4059 | `label: 'Casino'` | `label: 'Games'` | Header nav items |
| ~4060 | `label: 'Live Casino'` | `label: 'Live Games'` | Header nav items |
| ~7309 | `label: 'Casino'` | `label: 'Games'` | Quick-links menu |
| ~7310 | `label: 'Live Casino'` | `label: 'Live Games'` | Quick-links menu |
| ~7323 | `item.label === 'Casino'` | `item.label === 'Games'` | Active-state check |
| ~7501 | `Casino` (SidebarMenuButton span) | `Games` | Main nav header |
| ~8240 | `Casino` (sidebar button span) | `Games` | Sidebar nav |
| ~2721 | `Casino` (footer h3) | `Games` | Footer heading |
| ~2723 | `Play Casino` | `Play Games` | Footer link |
| ~5813 | `Casino` (footer h3) | `Games` | Footer heading |
| ~5815 | `Play Casino` | `Play Games` | Footer link |
| ~10492 | `Casino` (footer h3) | `Games` | Footer heading |
| ~10494 | `Play Casino` | `Play Games` | Footer link |

### 3. `app/casino/page.tsx` (Casino Page)

| Line(s) | Current Text | New Text | Context |
|---------|-------------|----------|---------|
| ~4099 | `label: 'Casino'` | `label: 'Games'` | Header nav items |
| ~7312 | `label: 'Casino'` | `label: 'Games'` | Header nav items |
| ~7313 | `label: 'Live Casino'` | `label: 'Live Games'` | Header nav items |
| ~9014 | `label: 'Casino'` | `label: 'Games'` | Quick-links menu |
| ~9015 | `label: 'Live Casino'` | `label: 'Live Games'` | Quick-links menu |
| ~9030 | `item.label === 'Casino'` | `item.label === 'Games'` | Active-state check |
| ~9217 | `Casino` (SidebarMenuButton span) | `Games` | Main nav header |
| ~10060 | `label: 'Casino'` | `label: 'Games'` | Conditional nav |
| ~10061 | `label: 'Live Casino'` | `label: 'Live Games'` | Conditional nav |
| ~3248 | `Casino` (footer h3) | `Games` | Footer heading |
| ~3250 | `Play Casino` | `Play Games` | Footer link |
| ~5821 | `Casino` (footer h3) | `Games` | Footer heading |
| ~5823 | `Play Casino` | `Play Games` | Footer link |
| ~7790 | `Casino` (footer h3) | `Games` | Footer heading |
| ~7792 | `Play Casino` | `Play Games` | Footer link |
| ~13531 | `Casino` (footer h3) | `Games` | Footer heading |
| ~13533 | `Play Casino` | `Play Games` | Footer link |

## Out of Scope (Explicitly NOT Changed)

| Item | Why |
|------|-----|
| URL routes (`/casino`, `/casino?tab=live`, etc.) | Spec requirement FR-007: routes must remain unchanged |
| `trackNav('casino', ...)` event keys | Internal analytics identifiers, not user-facing |
| `page: 'casino' as const` type values | Internal page state identifiers, not displayed to users |
| Chat room labels ("Casino Chat") | Out of scope per spec assumptions |
| Tab labels in Promos/Bonus sections (`'Casino'` tab) | These are product-category tabs within page content, not navigation |
| `liveCasinoGames` variable names | Internal code identifiers, not user-facing |
| Banner image paths (`/banners/casino/...`) | Asset paths, not user-facing text |
| `components/casino/` directory/imports | Internal module structure |
| `'Live Casino'` sidebar category label | This is a game-category label in the games sidebar, not primary navigation |
| `activeRoom === 'casino'` in chat | Chat subsystem, out of scope |

## Project Structure

### Documentation (this feature)

```text
specs/001-casino-to-games/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 research output
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Task breakdown (generated by /speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── page.tsx             # Homepage — nav header, quick-links, footer
├── navtest/
│   └── page.tsx         # Nav test page — nav header, quick-links, footer
└── casino/
    └── page.tsx         # Casino page — nav header, quick-links, footer
```

**Structure Decision**: No new files or directories. All changes are inline text replacements in existing page components.

## Complexity Tracking

No constitution violations. No complexity justifications needed. This is a minimal-risk, text-only change.
