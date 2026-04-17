# Research: Casino Name Change to Games

**Feature**: Casino Name Change to Games  
**Date**: 2026-04-17

## Research Task 1: Navigation Pattern and Duplication

**Decision**: The navigation is not a shared component — it is duplicated inline across ~73+ page files. Each file defines its own `NavTestPageContent` function (or equivalent) containing mobile strips, quick-link arrays, desktop sidebar buttons, and sub-nav pills.

**Rationale**: The current architecture duplicates the full navigation shell in every route-level page component. There is no shared `MainNav` or `NavBar` import. The label text appears in multiple patterns:
1. `{ label: 'Casino', page: 'casino' }` — mobile horizontal strips
2. `{ label: 'Casino', onClick: () => ... }` — quick-link arrays
3. `<span>Casino</span>` inside `SidebarMenuButton` — desktop nav buttons
4. `{ label: 'Casino', page: 'casino' }` — sub-nav pill spreads
5. Conditional checks like `item.label === 'Casino'`

**Alternatives considered**: Extracting a shared navigation component would be ideal but is a separate refactoring effort outside the scope of this feature.

## Research Task 2: Scope of "Casino" References

**Decision**: Only user-facing navigation labels are in scope. Internal identifiers, chat room names, analytics event slugs, route paths, design tokens, and page content are excluded.

**Rationale**: The user request is specifically about the main navigation label. Changing URLs (`/casino`) would break existing bookmarks and SEO. Changing analytics slugs (`trackNav('casino', ...)`) would break reporting continuity. Chat room identifiers are system-internal.

**What changes**:
- `label: 'Casino'` → `label: 'Games'` in all navigation arrays
- `label: 'Live Casino'` → `label: 'Live Games'` in all navigation arrays
- `<span className="relative z-10">Casino</span>` → `<span className="relative z-10">Games</span>` in desktop SidebarMenuButton
- `<span className="relative z-10">Live Casino</span>` → `<span className="relative z-10">Live Games</span>` in desktop SidebarMenuButton
- Conditional checks `item.label === 'Casino'` → `item.label === 'Games'`

**What does NOT change**:
- URL paths (`/casino`, `/casino?tab=live`, etc.)
- `page: 'casino'` / `page: 'liveCasino'` identifiers
- `product: 'casino'` / `product: 'liveCasino'` identifiers
- `trackNav('casino', ...)` first argument (analytics slug)
- `trackPageView('casino', ...)` first argument
- `visibleProducts.casino` / `visibleProducts.liveCasino` state keys
- `activeRoom === 'casino'` chat identifiers
- Design token references
- `layoutId="casinoNavPill"` animation identifiers

## Research Task 3: Files Requiring Changes

**Decision**: Approximately 73 `.tsx` files contain `label: 'Casino'` and `label: 'Live Casino'` that need updating. Key file categories:

| Category | Files | Pattern |
|----------|-------|---------|
| Casino page | `app/casino/page.tsx` | Multiple nav patterns, desktop buttons, quick links |
| Homepage | `app/page.tsx` | Quick links, desktop sidebar buttons |
| Navtest page | `app/navtest/page.tsx` | Mobile strip, quick links, desktop buttons |
| Sports pages | ~65 files under `app/sports/**/page.tsx` | Mobile strip, quick links |
| Account page | `app/account/page.tsx` | Quick links |
| Library page | `app/library/page.tsx` | Quick links |
| Journey map | `app/journey-map/page.tsx` | Quick links |
| Community | `app/community/page.tsx` | Quick links |
| Poker | `app/poker/page.tsx` | Quick links |
| VIP Rewards | `app/vip-rewards/page.tsx` | Quick links |
| Design customizer | `components/design-customizer.tsx` | Product toggle labels |

**Rationale**: Comprehensive search across all `.tsx` files for navigation label patterns.

## Research Task 4: trackNav Display Name Parameter

**Decision**: The second argument to `trackNav()` (the display name) should be updated to match the new label: `trackNav('casino', 'Games')` and `trackNav('casino', 'Live Games')`.

**Rationale**: The first argument is an analytics identifier/slug that should remain stable for reporting. The second argument is a human-readable display name used for event labeling — it should match what the user sees.

**Alternatives considered**: Leaving the display name as-is would create a mismatch between analytics event labels and actual UI text.
