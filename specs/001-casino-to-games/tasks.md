# Tasks: Change Casino to Games

**Input**: Design documents from `/specs/001-casino-to-games/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No setup needed. This feature involves only text replacements in existing files. No new dependencies, configuration, or project structure changes required.

*(No tasks in this phase)*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No foundational work needed. All changes are independent string replacements within existing components.

*(No tasks in this phase)*

---

## Phase 3: User Story 1 - Main Navigation Label Update (Priority: P1) MVP

**Goal**: Rename the "Casino" label to "Games" and "Live Casino" to "Live Games" in the main navigation header on all pages.

**Independent Test**: Load any page on the site and verify the main navigation header menu button reads "Games" instead of "Casino" and "Live Games" instead of "Live Casino" on both desktop and mobile viewports.

### Implementation for User Story 1

- [ ] T001 [P] [US1] Rename "Casino" to "Games" in main nav header SidebarMenuButton in app/page.tsx (~line 2185-2187)
- [ ] T002 [P] [US1] Rename "Live Casino" to "Live Games" in main nav header SidebarMenuButton in app/page.tsx (~line 2193-2195)
- [ ] T003 [P] [US1] Rename "Casino" to "Games" in main nav header SidebarMenuButton span in app/navtest/page.tsx (~line 7501)
- [ ] T004 [P] [US1] Rename "Casino" to "Games" in sidebar nav button span in app/navtest/page.tsx (~line 8240)
- [ ] T005 [P] [US1] Rename "Casino" to "Games" in header nav item label in app/navtest/page.tsx (~line 4059)
- [ ] T006 [P] [US1] Rename "Live Casino" to "Live Games" in header nav item label in app/navtest/page.tsx (~line 4060)
- [ ] T007 [P] [US1] Rename "Casino" to "Games" in main nav header SidebarMenuButton span in app/casino/page.tsx (~line 9217)
- [ ] T008 [P] [US1] Rename "Casino" to "Games" in header nav item labels in app/casino/page.tsx (~lines 4099, 7312, 10060)
- [ ] T009 [P] [US1] Rename "Live Casino" to "Live Games" in header nav item labels in app/casino/page.tsx (~lines 7313, 10061)
- [ ] T010 [P] [US1] Update active-state condition `item.label === 'Casino'` to `item.label === 'Games'` in app/navtest/page.tsx (~line 7323)
- [ ] T011 [P] [US1] Update active-state condition `item.label === 'Casino'` to `item.label === 'Games'` in app/casino/page.tsx (~line 9030)

**Checkpoint**: At this point, the main navigation header on all pages should display "Games" and "Live Games" instead of "Casino" and "Live Casino."

---

## Phase 4: User Story 2 - Quick-Links and Secondary Navigation Update (Priority: P2)

**Goal**: Update all quick-links menus and footer sections to say "Games" / "Live Games" / "Play Games" for consistency with the main navigation.

**Independent Test**: Open the quick-links overlay and scroll to the footer on each page. Verify all former "Casino" labels now read "Games" and "Play Casino" reads "Play Games."

### Implementation for User Story 2

#### Quick-Links Menu Updates

- [ ] T012 [P] [US2] Rename quick-link `label: 'Casino'` to `label: 'Games'` in app/page.tsx (~line 2093)
- [ ] T013 [P] [US2] Rename quick-link `label: 'Live Casino'` to `label: 'Live Games'` in app/page.tsx (~line 2094)
- [ ] T014 [P] [US2] Rename quick-link `label: 'Casino'` to `label: 'Games'` in app/navtest/page.tsx (~line 7309)
- [ ] T015 [P] [US2] Rename quick-link `label: 'Live Casino'` to `label: 'Live Games'` in app/navtest/page.tsx (~line 7310)
- [ ] T016 [P] [US2] Rename quick-link `label: 'Casino'` to `label: 'Games'` in app/casino/page.tsx (~line 9014)
- [ ] T017 [P] [US2] Rename quick-link `label: 'Live Casino'` to `label: 'Live Games'` in app/casino/page.tsx (~line 9015)

#### Footer Updates

- [ ] T018 [P] [US2] Rename footer heading "Casino" to "Games" and link "Play Casino" to "Play Games" in app/page.tsx (~lines 3801, 3803)
- [ ] T019 [P] [US2] Rename footer heading "Casino" to "Games" and link "Play Casino" to "Play Games" in app/navtest/page.tsx (~lines 2721, 2723)
- [ ] T020 [P] [US2] Rename footer heading "Casino" to "Games" and link "Play Casino" to "Play Games" in app/navtest/page.tsx (~lines 5813, 5815)
- [ ] T021 [P] [US2] Rename footer heading "Casino" to "Games" and link "Play Casino" to "Play Games" in app/navtest/page.tsx (~lines 10492, 10494)
- [ ] T022 [P] [US2] Rename footer heading "Casino" to "Games" and link "Play Casino" to "Play Games" in app/casino/page.tsx (~lines 3248, 3250)
- [ ] T023 [P] [US2] Rename footer heading "Casino" to "Games" and link "Play Casino" to "Play Games" in app/casino/page.tsx (~lines 5821, 5823)
- [ ] T024 [P] [US2] Rename footer heading "Casino" to "Games" and link "Play Casino" to "Play Games" in app/casino/page.tsx (~lines 7790, 7792)
- [ ] T025 [P] [US2] Rename footer heading "Casino" to "Games" and link "Play Casino" to "Play Games" in app/casino/page.tsx (~lines 13531, 13533)

**Checkpoint**: All navigation surfaces (main header, quick-links, and footer) now consistently display "Games" / "Live Games" / "Play Games" instead of "Casino" / "Live Casino" / "Play Casino."

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across all pages and viewports.

- [ ] T026 Verify all three pages render correctly with no broken navigation links (all destinations unchanged)
- [ ] T027 Verify mobile responsive views show "Games" labels correctly on all pages
- [ ] T028 Verify active-state highlighting works correctly for the renamed "Games" nav item on all pages

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Skipped — no setup needed
- **Foundational (Phase 2)**: Skipped — no foundational work needed
- **User Story 1 (Phase 3)**: Can start immediately — all tasks are independent [P] across different files
- **User Story 2 (Phase 4)**: Can start immediately in parallel with US1 — all tasks are independent [P] across different files
- **Polish (Phase 5)**: Depends on all Phase 3 and Phase 4 tasks being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies — can start immediately
- **User Story 2 (P2)**: No dependencies on US1 — can start in parallel, but logically follows US1 for consistency review

### Parallel Opportunities

- All tasks in Phase 3 are marked [P] and touch different locations — can all run in parallel
- All tasks in Phase 4 are marked [P] and touch different locations — can all run in parallel
- Phase 3 and Phase 4 can run in parallel since they modify different code locations within the same files
- Within each file, changes are to distinct string literals at different line numbers, so no merge conflicts

---

## Parallel Example: User Story 1

```bash
# All main nav header tasks can run in parallel (different files):
Task: T001 "Rename Casino to Games in main nav SidebarMenuButton in app/page.tsx"
Task: T003 "Rename Casino to Games in main nav SidebarMenuButton span in app/navtest/page.tsx"
Task: T007 "Rename Casino to Games in main nav SidebarMenuButton span in app/casino/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: Rename main nav header labels across all 3 page files
2. **STOP and VALIDATE**: Verify "Games" / "Live Games" appears in main nav on all pages
3. Ship if time-constrained — main nav is the highest-visibility change

### Incremental Delivery

1. Complete US1 (main nav) → Validate → Most visible change is live
2. Complete US2 (quick-links + footer) → Validate → Full consistency achieved
3. Complete Polish → Final cross-page, cross-viewport verification

### Single Developer Strategy

Since all changes are text replacements in 3 files, a single developer can complete all tasks in one pass per file:
1. Open `app/page.tsx` — apply T001, T002, T012, T013, T018
2. Open `app/navtest/page.tsx` — apply T003, T004, T005, T006, T010, T014, T015, T019, T020, T021
3. Open `app/casino/page.tsx` — apply T007, T008, T009, T011, T016, T017, T022, T023, T024, T025
4. Run verification tasks T026–T028

---

## Summary

| Metric | Value |
|--------|-------|
| Total tasks | 28 |
| User Story 1 tasks | 11 |
| User Story 2 tasks | 14 |
| Polish tasks | 3 |
| Files affected | 3 |
| Parallel opportunities | All implementation tasks (T001–T025) can run in parallel |
| MVP scope | User Story 1 (T001–T011) — main nav header only |
