# Tasks: Casino Name Change to Games

**Input**: Design documents from `/specs/001-casino-name-change/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: Next.js App Router under `app/`, shared components under `components/`
- All paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No new project setup needed — this is a label-rename in an existing codebase. This phase covers orientation and verification tooling.

- [x] T001 Verify all target files exist and are accessible by listing files matching `app/**/page.tsx` and `components/design-customizer.tsx`
- [x] T002 Create a search query to verify completion: `rg "label: 'Casino'" -g '*.tsx'` should return zero results after all changes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No foundational/blocking work needed. All user story tasks can proceed directly after setup.

**Checkpoint**: No blocking prerequisites — proceed to user story phases.

---

## Phase 3: User Story 1 — Main Navigation Label Rename (Priority: P1) 🎯 MVP

**Goal**: Change "Casino" to "Games" in all navigation labels across all pages.

**Independent Test**: Navigate to any page. Verify the main navigation item reads "Games" instead of "Casino." Click it and confirm it routes to `/casino`.

### Implementation for User Story 1

#### Core pages (homepage, casino, navtest)

- [x] T003 [US1] Rename all `label: 'Casino'` → `label: 'Games'` in navigation arrays, update `item.label === 'Casino'` conditionals to `item.label === 'Games'`, update desktop `<span>Casino</span>` → `<span>Games</span>`, and update `trackNav`/`trackPageView` display names from `'Casino'` to `'Games'` in app/page.tsx
- [x] T004 [US1] Rename all `label: 'Casino'` → `label: 'Games'` in navigation arrays (mobile strips, quick links, sub-nav pills), update `item.label === 'Casino'` conditionals, update desktop `<span>Casino</span>` → `<span>Games</span>`, and update `trackNav`/`trackPageView` display names in app/casino/page.tsx
- [x] T005 [US1] Rename all `label: 'Casino'` → `label: 'Games'` in navigation arrays, update conditionals, update desktop `<span>Casino</span>` → `<span>Games</span>` in app/navtest/page.tsx

#### Sports hub and soccer pages

- [x] T006 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/page.tsx
- [x] T007 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/page.tsx
- [x] T008 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/premier-league/page.tsx
- [x] T009 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/la-liga/page.tsx
- [x] T010 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/bundesliga/page.tsx
- [x] T011 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/serie-a/page.tsx
- [x] T012 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/ligue-1/page.tsx
- [x] T013 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/champions-league/page.tsx
- [x] T014 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/fa-cup/page.tsx
- [x] T015 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/copa-america/page.tsx
- [x] T016 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/championship/page.tsx
- [x] T017 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/league-one/page.tsx
- [x] T018 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/mls/page.tsx

#### Football pages

- [x] T019 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/football/page.tsx
- [x] T020 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/football/nfl/page.tsx
- [x] T021 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/football/ncaaf/page.tsx
- [x] T022 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/football/cfl/page.tsx
- [x] T023 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/football/xfl/page.tsx
- [x] T024 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/football/usfl/page.tsx

#### Basketball pages

- [x] T025 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/basketball/page.tsx
- [x] T026 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/basketball/nba/page.tsx
- [x] T027 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/basketball/ncaab/page.tsx
- [x] T028 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/basketball/wnba/page.tsx
- [x] T029 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/basketball/euroleague/page.tsx

#### Baseball pages

- [x] T030 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/baseball/page.tsx
- [x] T031 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/baseball/mlb/page.tsx
- [x] T032 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/baseball/npb/page.tsx
- [x] T033 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/baseball/kbo/page.tsx

#### Hockey pages

- [x] T034 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/hockey/page.tsx
- [x] T035 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/hockey/nhl/page.tsx

#### Tennis pages

- [x] T036 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/tennis/page.tsx
- [x] T037 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/tennis/atp/page.tsx
- [x] T038 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/tennis/wta/page.tsx
- [x] T039 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/tennis/grand-slams/page.tsx
- [x] T040 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/tennis/davis-cup/page.tsx
- [x] T041 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/tennis/itf/page.tsx

#### MMA pages

- [x] T042 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/mma/page.tsx
- [x] T043 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/mma/ufc/page.tsx
- [x] T044 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/mma/bellator/page.tsx
- [x] T045 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/mma/one-championship/page.tsx
- [x] T046 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/mma/pfl/page.tsx
- [x] T047 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/mma/lfa/page.tsx

#### Rugby pages

- [x] T048 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/rugby/page.tsx
- [x] T049 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/rugby/six-nations/page.tsx
- [x] T050 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/rugby/premiership/page.tsx
- [x] T051 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/rugby/super-rugby/page.tsx
- [x] T052 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/rugby/rugby-world-cup/page.tsx
- [x] T053 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/rugby/top-14/page.tsx

#### Volleyball pages

- [x] T054 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/volleyball/page.tsx
- [x] T055 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/volleyball/superliga/page.tsx
- [x] T056 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/volleyball/fivb/page.tsx
- [x] T057 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/volleyball/cev/page.tsx
- [x] T058 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/volleyball/serie-a1/page.tsx

#### Table Tennis pages

- [x] T059 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/table-tennis/page.tsx
- [x] T060 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/table-tennis/wtt-champions/page.tsx
- [x] T061 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/table-tennis/t2-diamond/page.tsx
- [x] T062 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/table-tennis/ittf-world-tour/page.tsx

#### Lacrosse pages

- [x] T063 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/lacrosse/page.tsx
- [x] T064 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/lacrosse/pll/page.tsx
- [x] T065 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/lacrosse/nll/page.tsx
- [x] T066 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/lacrosse/ncaa/page.tsx
- [x] T067 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/lacrosse/world-championship/page.tsx

#### Pool pages

- [x] T068 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/pool/page.tsx
- [x] T069 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/pool/mosconi-cup/page.tsx
- [x] T070 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/pool/us-open/page.tsx
- [x] T071 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/pool/wpa/page.tsx
- [x] T072 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/pool/world-pool-masters/page.tsx

#### Other pages

- [x] T073 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/my-feed/page.tsx
- [x] T074 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/account/page.tsx
- [x] T075 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/library/page.tsx
- [x] T076 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/journey-map/page.tsx
- [x] T077 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` in product toggle labels in components/design-customizer.tsx

**Checkpoint**: At this point, all navigation touchpoints reading "Casino" should now read "Games." Verify by running `rg "label: 'Casino'" -g '*.tsx'` — should return zero results.

---

## Phase 4: User Story 2 — Related Navigation Labels Update (Priority: P2)

**Goal**: Change "Live Casino" to "Live Games" in all navigation labels across all pages.

**Independent Test**: Navigate to any page with sidebar or quick-links. Verify "Live Casino" now reads "Live Games." Click it and confirm correct routing.

### Implementation for User Story 2

#### Core pages (homepage, casino, navtest)

- [x] T078 [US2] Rename all `label: 'Live Casino'` → `label: 'Live Games'` in navigation arrays, update desktop `<span>Live Casino</span>` → `<span>Live Games</span>`, and update `trackNav`/`trackPageView` display names from `'Live Casino'` to `'Live Games'` in app/page.tsx
- [x] T079 [US2] Rename all `label: 'Live Casino'` → `label: 'Live Games'` in navigation arrays (mobile strips, quick links, sub-nav pills), update desktop `<span>Live Casino</span>` → `<span>Live Games</span>`, and update `trackNav`/`trackPageView` display names in app/casino/page.tsx
- [x] T080 [US2] Rename all `label: 'Live Casino'` → `label: 'Live Games'` in navigation arrays, update desktop `<span>Live Casino</span>` → `<span>Live Games</span>` in app/navtest/page.tsx

#### Sports pages (all — parallelizable, same pattern in each file)

- [x] T081 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/page.tsx
- [x] T082 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/page.tsx
- [x] T083 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/premier-league/page.tsx
- [x] T084 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/la-liga/page.tsx
- [x] T085 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/bundesliga/page.tsx
- [x] T086 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/serie-a/page.tsx
- [x] T087 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/ligue-1/page.tsx
- [x] T088 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/champions-league/page.tsx
- [x] T089 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/fa-cup/page.tsx
- [x] T090 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/copa-america/page.tsx
- [x] T091 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/championship/page.tsx
- [x] T092 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/league-one/page.tsx
- [x] T093 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/mls/page.tsx
- [x] T094 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/football/page.tsx
- [x] T095 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/football/nfl/page.tsx
- [x] T096 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/football/ncaaf/page.tsx
- [x] T097 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/football/cfl/page.tsx
- [x] T098 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/football/xfl/page.tsx
- [x] T099 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/football/usfl/page.tsx
- [x] T100 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/basketball/page.tsx
- [x] T101 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/basketball/nba/page.tsx
- [x] T102 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/basketball/ncaab/page.tsx
- [x] T103 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/basketball/wnba/page.tsx
- [x] T104 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/basketball/euroleague/page.tsx
- [x] T105 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/baseball/page.tsx
- [x] T106 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/baseball/mlb/page.tsx
- [x] T107 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/baseball/npb/page.tsx
- [x] T108 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/baseball/kbo/page.tsx
- [x] T109 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/hockey/page.tsx
- [x] T110 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/hockey/nhl/page.tsx
- [x] T111 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/tennis/page.tsx
- [x] T112 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/tennis/atp/page.tsx
- [x] T113 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/tennis/wta/page.tsx
- [x] T114 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/tennis/grand-slams/page.tsx
- [x] T115 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/tennis/davis-cup/page.tsx
- [x] T116 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/tennis/itf/page.tsx
- [x] T117 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/mma/page.tsx
- [x] T118 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/mma/ufc/page.tsx
- [x] T119 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/mma/bellator/page.tsx
- [x] T120 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/mma/one-championship/page.tsx
- [x] T121 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/mma/pfl/page.tsx
- [x] T122 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/mma/lfa/page.tsx
- [x] T123 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/rugby/page.tsx
- [x] T124 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/rugby/six-nations/page.tsx
- [x] T125 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/rugby/premiership/page.tsx
- [x] T126 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/rugby/super-rugby/page.tsx
- [x] T127 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/rugby/rugby-world-cup/page.tsx
- [x] T128 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/rugby/top-14/page.tsx
- [x] T129 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/volleyball/page.tsx
- [x] T130 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/volleyball/superliga/page.tsx
- [x] T131 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/volleyball/fivb/page.tsx
- [x] T132 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/volleyball/cev/page.tsx
- [x] T133 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/volleyball/serie-a1/page.tsx
- [x] T134 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/table-tennis/page.tsx
- [x] T135 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/table-tennis/wtt-champions/page.tsx
- [x] T136 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/table-tennis/t2-diamond/page.tsx
- [x] T137 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/table-tennis/ittf-world-tour/page.tsx
- [x] T138 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/lacrosse/page.tsx
- [x] T139 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/lacrosse/pll/page.tsx
- [x] T140 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/lacrosse/nll/page.tsx
- [x] T141 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/lacrosse/ncaa/page.tsx
- [x] T142 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/lacrosse/world-championship/page.tsx
- [x] T143 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/pool/page.tsx
- [x] T144 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/pool/mosconi-cup/page.tsx
- [x] T145 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/pool/us-open/page.tsx
- [x] T146 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/pool/wpa/page.tsx
- [x] T147 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/pool/world-pool-masters/page.tsx
- [x] T148 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/my-feed/page.tsx

#### Other pages

- [x] T149 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/account/page.tsx
- [x] T150 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/library/page.tsx
- [x] T151 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/journey-map/page.tsx
- [x] T152 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in components/design-customizer.tsx

**Checkpoint**: At this point, all navigation touchpoints reading "Live Casino" should now read "Live Games." Verify by running `rg "label: 'Live Casino'" -g '*.tsx'` — should return zero results.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cleanup across all user stories.

- [x] T153 Run search verification: `rg "label: 'Casino'" -g '*.tsx'` and `rg "label: 'Live Casino'" -g '*.tsx'` return zero results
- [x] T154 Run search verification: `rg ">Casino</span>" -g '*.tsx'` and `rg ">Live Casino</span>" -g '*.tsx'` return zero results in navigation contexts
- [x] T155 Visual spot-check on homepage, one sports page, casino page, and account page at desktop and mobile viewports

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: N/A — no blocking work
- **User Story 1 (Phase 3)**: Can start immediately — "Casino" → "Games" rename
- **User Story 2 (Phase 4)**: Can start in parallel with Phase 3 — "Live Casino" → "Live Games" rename
- **Polish (Phase 5)**: Depends on Phase 3 and Phase 4 completion

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories — rename "Casino" labels independently
- **User Story 2 (P2)**: No dependencies on US1 — rename "Live Casino" labels independently. Can run in parallel.

### Within Each User Story

- Core pages (T003-T005, T078-T080) first — these are more complex with multiple nav patterns
- Sports pages are all parallelizable (same pattern repeated)
- Other pages (account, library, etc.) are parallelizable

### Parallel Opportunities

- All sports page tasks within a user story are fully parallelizable (different files, identical pattern)
- US1 and US2 can run in complete parallel (different string targets, same files)
- In practice, a single implementer could perform both US1 and US2 per-file in one pass

---

## Parallel Example: User Story 1 Sports Pages

```bash
# All of these can run simultaneously:
Task: "Rename label: 'Casino' → label: 'Games' in app/sports/soccer/page.tsx"
Task: "Rename label: 'Casino' → label: 'Games' in app/sports/football/page.tsx"
Task: "Rename label: 'Casino' → label: 'Games' in app/sports/basketball/page.tsx"
# ... all 65+ sports pages in parallel
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verification queries)
2. Complete Phase 3: User Story 1 — all "Casino" → "Games" renames
3. **STOP and VALIDATE**: Run verification search + visual spot-check
4. Deploy/demo if ready — core navigation rename is complete

### Incremental Delivery

1. User Story 1 → "Casino" → "Games" across all 74 files → Validate (MVP!)
2. User Story 2 → "Live Casino" → "Live Games" across all 74 files → Validate
3. Polish phase → Final cross-cutting verification

### Efficient Single-Pass Strategy

Since both user stories target the same set of files, the most efficient approach is to process both renames per-file in a single pass:

1. For each of the ~74 files: replace `'Casino'` → `'Games'` AND `'Live Casino'` → `'Live Games'` in one edit session
2. This avoids reading each large file twice
3. Run verification searches after all files are processed

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- The most efficient implementation is a single pass through each file updating both labels
- Total task count: 155
- US1 tasks: 75 (T003–T077)
- US2 tasks: 75 (T078–T152)
- Setup/Polish: 5 (T001–T002, T153–T155)
