# Research: Change Casino to Games

**Feature**: Change Casino to Games  
**Date**: 2026-04-16

## Research Tasks

### R1: Identify all navigation instances of "Casino" in the codebase

**Decision**: Three page files contain navigation-level "Casino" labels that must be renamed.

**Rationale**: A codebase search for `Casino` (case-sensitive) across all `.tsx` files produced matches in many files, but only three files contain **navigation-level** labels (main header nav, quick-links menu, footer nav sections):
- `app/page.tsx` — Homepage
- `app/navtest/page.tsx` — Nav test page
- `app/casino/page.tsx` — Casino page

Other matches are in page content (game data, promotional copy, internal variable names, chat subsystem, analytics events) and are out of scope.

**Alternatives considered**: 
- Renaming all "Casino" strings site-wide — rejected because the feature request specifically targets navigation labels only
- Creating a centralized nav config and referencing it across pages — would be a good refactor but is out of scope for a label-rename feature

### R2: Determine if "Live Casino" should also change

**Decision**: Yes — "Live Casino" becomes "Live Games" in all navigation contexts for consistency.

**Rationale**: The spec explicitly includes this in FR-005. The "Live Casino" label appears alongside "Casino" in the same navigation structures (header menu, quick-links). Changing one without the other would create inconsistency.

**Alternatives considered**:
- Keeping "Live Casino" unchanged — rejected because it contradicts the consistency goal stated in the feature description

### R3: Determine impact on internal identifiers and routes

**Decision**: No routes or internal identifiers change. Only user-facing text strings are modified.

**Rationale**: 
- URL routes (`/casino`, `/casino?tab=live`) are stable paths that may be bookmarked, indexed by search engines, or referenced in external links. Changing them would be a breaking change beyond the scope of a label rename.
- Tracking identifiers (`trackNav('casino', ...)`) are analytics keys consumed by internal systems. Changing them would break analytics continuity.
- Page state constants (`page: 'casino' as const`) are TypeScript type-level identifiers. Changing them would require cascading type changes with no user-visible benefit.

**Alternatives considered**:
- Renaming routes to `/games` — rejected as out of scope and a breaking change
- Updating analytics keys to `'games'` — rejected to preserve analytics continuity

### R4: Assess whether active-state CSS conditions need updating

**Decision**: Yes — conditional checks like `item.label === 'Casino'` that control active/highlighted styling must be updated to `item.label === 'Games'` wherever the label itself changes.

**Rationale**: These conditions compare against the label string to determine which nav item is highlighted. If the label changes but the condition does not, the active state will never match.

**Alternatives considered**: None — this is a mechanical consequence of the label change.
