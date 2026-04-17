# Feature Specification: Casino Name Change to Games

**Feature Branch**: `apop-spec/cmo2z4u7m0-mo2z6ynt`  
**Created**: 2026-04-17  
**Status**: Draft  
**Input**: User description: "In the main nav change casino to say Games"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Main Navigation Label Rename (Priority: P1)

As a user browsing the site, I see "Games" instead of "Casino" in the main navigation so the product feels more approachable and accurately reflects the broader game offering.

**Why this priority**: This is the core request — renaming the primary navigation label is the single change that delivers the entire feature value. Every page that renders the shared navigation must display "Games" instead of "Casino."

**Independent Test**: Navigate to any page on the site (homepage, any sports page, casino page, account page). Verify the main navigation item that previously read "Casino" now reads "Games." Confirm that clicking "Games" still routes to the same destination (`/casino`).

**Acceptance Scenarios**:

1. **Given** the user is on any page with the main navigation visible, **When** they look at the top/primary navigation bar, **Then** the label that previously said "Casino" now says "Games."
2. **Given** the user clicks the "Games" navigation item, **When** the page loads, **Then** they are taken to the existing casino/games landing page at `/casino`.
3. **Given** the user is on a mobile device viewing the quick-links or hamburger menu, **When** they open the navigation, **Then** the item reads "Games" instead of "Casino."

---

### User Story 2 - Related Navigation Labels Update (Priority: P2)

As a user, I see "Live Games" instead of "Live Casino" in navigation menus and sidebar items so the terminology is consistent across the product.

**Why this priority**: Consistency matters — once "Casino" becomes "Games" in the primary nav, secondary references like "Live Casino" should also be updated to avoid a mixed-terminology experience.

**Independent Test**: Navigate to a page with the sidebar or quick-links visible. Verify "Live Casino" now reads "Live Games." Confirm routing still goes to `/casino?tab=live` (or equivalent).

**Acceptance Scenarios**:

1. **Given** the user opens the mobile quick-links menu on any page, **When** they view the list, **Then** "Live Casino" is replaced with "Live Games."
2. **Given** the user views the left sidebar on desktop, **When** they scan sidebar items, **Then** "Live Casino" is replaced with "Live Games."
3. **Given** the user clicks the "Live Games" link, **When** the page loads, **Then** they are routed to the live casino/games experience at the same URL as before.

---

### Edge Cases

- What happens if a user has bookmarked or deep-linked directly to `/casino`? The URL does not change — only the display label changes, so existing bookmarks and links continue to work.
- What happens on pages that embed a chat room labelled "casino"? Chat room identifiers are internal system labels, not user-facing navigation, and are out of scope for this change.
- What happens to SEO or page titles referencing "Casino"? Page titles and meta tags on the `/casino` route are out of scope for this navigation-label-only change unless explicitly included in a follow-up.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The primary navigation item currently labelled "Casino" MUST display the text "Games" on all pages site-wide.
- **FR-002**: The navigation item labelled "Live Casino" MUST display the text "Live Games" in every location it appears (sidebar, quick-links, mobile menus).
- **FR-003**: Clicking the renamed "Games" navigation item MUST route the user to the same destination as the current "Casino" link (`/casino`).
- **FR-004**: Clicking the renamed "Live Games" navigation item MUST route the user to the same destination as the current "Live Casino" link (`/casino?tab=live` or `/casino?live=true`).
- **FR-005**: The label change MUST apply across all viewport sizes (desktop, tablet, mobile).
- **FR-006**: No URLs or routes MUST change as part of this feature — only display labels are affected.

### Key Entities

- **Navigation Item**: A label-route pair rendered in the main navigation, sidebar, and mobile quick-links. Key attributes: display label (text shown to user), route (URL navigated to on click), icon (visual indicator).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of navigation touchpoints that previously displayed "Casino" now display "Games."
- **SC-002**: 100% of navigation touchpoints that previously displayed "Live Casino" now display "Live Games."
- **SC-003**: All renamed navigation items route to the same destinations as before with zero broken links.
- **SC-004**: The change is visually consistent across desktop, tablet, and mobile breakpoints.

## Assumptions

- The URL paths (`/casino`, `/casino?tab=live`, `/casino?poker=true`) remain unchanged — this is a display-label-only change.
- "Poker" navigation items are not renamed as part of this feature since the user only requested "Casino → Games."
- Internal system identifiers (chat room names, analytics event names, design tokens) that reference "casino" are out of scope.
- The navigation component is duplicated across many page files (`app/casino/page.tsx`, `app/sports/**/page.tsx`, etc.) and each instance must be updated.
- No new components need to be created — this is a text-replacement change across existing components.
