# Feature Specification: Change Casino to Games

**Feature Branch**: `001-casino-to-games`  
**Created**: 2026-04-16  
**Status**: Draft  
**Input**: User description: "Make it clearer for users that this is games. In the main menu, change the word Casino to Games."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Main Navigation Label Update (Priority: P1)

A user visits the site and sees the main navigation menu. The menu item that currently reads "Casino" should instead read "Games." This makes it immediately clear that the section contains games, using language that is more intuitive and less industry-specific for a broader audience.

**Why this priority**: This is the core ask — renaming the primary navigation label is the single most visible change and the entire purpose of the feature. It affects every user on every page load.

**Independent Test**: Can be fully tested by loading any page on the site and verifying the main navigation header menu button reads "Games" instead of "Casino." Delivers value by improving clarity for all users.

**Acceptance Scenarios**:

1. **Given** a user is on any page of the site, **When** they look at the main navigation header, **Then** the menu item that previously read "Casino" now reads "Games"
2. **Given** a user clicks the "Games" menu item, **When** the page loads, **Then** they are navigated to the same destination as the former "Casino" link (i.e., `/casino` route)
3. **Given** a user is on a mobile device, **When** they view the navigation, **Then** the label also reads "Games" (not "Casino")

---

### User Story 2 - Quick-Links and Secondary Navigation Update (Priority: P2)

Throughout the site there are secondary navigation elements — quick-links menus, footer sections, and contextual nav items — that also reference "Casino." These should be updated to say "Games" for consistency with the main navigation.

**Why this priority**: After the primary nav is updated, inconsistency with secondary nav elements would confuse users. This story ensures cohesive language across all navigation surfaces.

**Independent Test**: Can be tested by opening the quick-links overlay, footer, and any sub-navigation menus, and verifying all former "Casino" labels now read "Games."

**Acceptance Scenarios**:

1. **Given** a user opens the quick-links menu, **When** they view the available links, **Then** the item that was "Casino" now reads "Games"
2. **Given** a user scrolls to the footer, **When** they look at the footer link groups, **Then** the section heading that was "Casino" now reads "Games" and the link "Play Casino" now reads "Play Games"
3. **Given** a user views the "Live Casino" label in any navigation context, **When** they read it, **Then** it reads "Live Games" for consistency

---

### Edge Cases

- What happens when a user has bookmarked or cached a page? The URL routes (e.g., `/casino`) remain unchanged — only the display label changes, so existing bookmarks continue to work.
- How does the system handle search or analytics events that reference "casino"? Tracking event identifiers (e.g., `trackNav('casino', ...)`) are internal and do not need to change for this feature; only user-facing text changes.
- What about the chat room label "Casino Chat"? Chat room labels are a separate product surface and are out of scope unless explicitly requested.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The main navigation header MUST display "Games" instead of "Casino" as the menu item label
- **FR-002**: The quick-links navigation menu MUST display "Games" instead of "Casino"
- **FR-003**: The footer navigation section heading MUST display "Games" instead of "Casino"
- **FR-004**: The footer link text "Play Casino" MUST be updated to "Play Games"
- **FR-005**: The "Live Casino" label in main and secondary navigation MUST be updated to "Live Games"
- **FR-006**: All navigation label changes MUST apply on both desktop and mobile viewports
- **FR-007**: Navigation destinations (URLs/routes) MUST remain unchanged — only display text is updated

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of main navigation instances of the word "Casino" are replaced with "Games" across all viewports
- **SC-002**: 100% of secondary navigation (quick-links, footer) instances of "Casino" are replaced with "Games"
- **SC-003**: Zero broken navigation links after the label change — all renamed items navigate to the same destinations as before
- **SC-004**: Users can identify the games section from the navigation menu within 2 seconds of viewing the page (same or improved findability vs. current)

## Assumptions

- URL routes (e.g., `/casino`, `/casino?tab=live`) will NOT change — only user-facing display text is updated
- Internal analytics tracking identifiers (e.g., `trackNav('casino', ...)`) are out of scope and will remain unchanged
- Chat room labels (e.g., "Casino Chat") are out of scope for this feature
- The rename applies only to navigation elements — page content, game category labels, and promotional copy that reference "casino" are not in scope
- The existing authentication and routing system will continue to work without modification
- No new assets (icons, images) are required — only text string changes
