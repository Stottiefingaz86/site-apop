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

- [ ] T001 Verify all target files exist and are accessible by listing files matching `app/**/page.tsx` and `components/design-customizer.tsx`
- [ ] T002 Create a search query to verify completion: `rg "label: 'Casino'" -g '*.tsx'` should return zero results after all changes

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

- [ ] T003 [US1] Rename all `label: 'Casino'` → `label: 'Games'` in navigation arrays, update `item.label === 'Casino'` conditionals to `item.label === 'Games'`, update desktop `<span>Casino</span>` → `<span>Games</span>`, and update `trackNav`/`trackPageView` display names from `'Casino'` to `'Games'` in app/page.tsx
- [ ] T004 [US1] Rename all `label: 'Casino'` → `label: 'Games'` in navigation arrays (mobile strips, quick links, sub-nav pills), update `item.label === 'Casino'` conditionals, update desktop `<span>Casino</span>` → `<span>Games</span>`, and update `trackNav`/`trackPageView` display names in app/casino/page.tsx
- [ ] T005 [US1] Rename all `label: 'Casino'` → `label: 'Games'` in navigation arrays, update conditionals, update desktop `<span>Casino</span>` → `<span>Games</span>` in app/navtest/page.tsx

#### Sports hub and soccer pages

- [ ] T006 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/page.tsx
- [ ] T007 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/page.tsx
- [ ] T008 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/premier-league/page.tsx
- [ ] T009 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/la-liga/page.tsx
- [ ] T010 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/bundesliga/page.tsx
- [ ] T011 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/serie-a/page.tsx
- [ ] T012 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/ligue-1/page.tsx
- [ ] T013 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/champions-league/page.tsx
- [ ] T014 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/fa-cup/page.tsx
- [ ] T015 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/copa-america/page.tsx
- [ ] T016 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/championship/page.tsx
- [ ] T017 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/league-one/page.tsx
- [ ] T018 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/soccer/mls/page.tsx

#### Football pages

- [ ] T019 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/football/page.tsx
- [ ] T020 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/football/nfl/page.tsx
- [ ] T021 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/football/ncaaf/page.tsx
- [ ] T022 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/football/cfl/page.tsx
- [ ] T023 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/football/xfl/page.tsx
- [ ] T024 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/football/usfl/page.tsx

#### Basketball pages

- [ ] T025 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/basketball/page.tsx
- [ ] T026 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/basketball/nba/page.tsx
- [ ] T027 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/basketball/ncaab/page.tsx
- [ ] T028 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/basketball/wnba/page.tsx
- [ ] T029 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/basketball/euroleague/page.tsx

#### Baseball pages

- [ ] T030 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/baseball/page.tsx
- [ ] T031 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/baseball/mlb/page.tsx
- [ ] T032 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/baseball/npb/page.tsx
- [ ] T033 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/baseball/kbo/page.tsx

#### Hockey pages

- [ ] T034 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/hockey/page.tsx
- [ ] T035 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/hockey/nhl/page.tsx

#### Tennis pages

- [ ] T036 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/tennis/page.tsx
- [ ] T037 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/tennis/atp/page.tsx
- [ ] T038 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/tennis/wta/page.tsx
- [ ] T039 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/tennis/grand-slams/page.tsx
- [ ] T040 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/tennis/davis-cup/page.tsx
- [ ] T041 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/tennis/itf/page.tsx

#### MMA pages

- [ ] T042 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/mma/page.tsx
- [ ] T043 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/mma/ufc/page.tsx
- [ ] T044 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/mma/bellator/page.tsx
- [ ] T045 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/mma/one-championship/page.tsx
- [ ] T046 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/mma/pfl/page.tsx
- [ ] T047 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/mma/lfa/page.tsx

#### Rugby pages

- [ ] T048 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/rugby/page.tsx
- [ ] T049 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/rugby/six-nations/page.tsx
- [ ] T050 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/rugby/premiership/page.tsx
- [ ] T051 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/rugby/super-rugby/page.tsx
- [ ] T052 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/rugby/rugby-world-cup/page.tsx
- [ ] T053 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/rugby/top-14/page.tsx

#### Volleyball pages

- [ ] T054 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/volleyball/page.tsx
- [ ] T055 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/volleyball/superliga/page.tsx
- [ ] T056 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/volleyball/fivb/page.tsx
- [ ] T057 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/volleyball/cev/page.tsx
- [ ] T058 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/volleyball/serie-a1/page.tsx

#### Table Tennis pages

- [ ] T059 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/table-tennis/page.tsx
- [ ] T060 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/table-tennis/wtt-champions/page.tsx
- [ ] T061 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/table-tennis/t2-diamond/page.tsx
- [ ] T062 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/table-tennis/ittf-world-tour/page.tsx

#### Lacrosse pages

- [ ] T063 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/lacrosse/page.tsx
- [ ] T064 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/lacrosse/pll/page.tsx
- [ ] T065 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/lacrosse/nll/page.tsx
- [ ] T066 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/lacrosse/ncaa/page.tsx
- [ ] T067 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/lacrosse/world-championship/page.tsx

#### Pool pages

- [ ] T068 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/pool/page.tsx
- [ ] T069 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/pool/mosconi-cup/page.tsx
- [ ] T070 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/pool/us-open/page.tsx
- [ ] T071 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/pool/wpa/page.tsx
- [ ] T072 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/pool/world-pool-masters/page.tsx

#### Other pages

- [ ] T073 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/sports/my-feed/page.tsx
- [ ] T074 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/account/page.tsx
- [ ] T075 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/library/page.tsx
- [ ] T076 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` and update conditionals in app/journey-map/page.tsx
- [ ] T077 [P] [US1] Rename `label: 'Casino'` → `label: 'Games'` in product toggle labels in components/design-customizer.tsx

**Checkpoint**: At this point, all navigation touchpoints reading "Casino" should now read "Games." Verify by running `rg "label: 'Casino'" -g '*.tsx'` — should return zero results.

---

## Phase 4: User Story 2 — Related Navigation Labels Update (Priority: P2)

**Goal**: Change "Live Casino" to "Live Games" in all navigation labels across all pages.

**Independent Test**: Navigate to any page with sidebar or quick-links. Verify "Live Casino" now reads "Live Games." Click it and confirm correct routing.

### Implementation for User Story 2

#### Core pages (homepage, casino, navtest)

- [ ] T078 [US2] Rename all `label: 'Live Casino'` → `label: 'Live Games'` in navigation arrays, update desktop `<span>Live Casino</span>` → `<span>Live Games</span>`, and update `trackNav`/`trackPageView` display names from `'Live Casino'` to `'Live Games'` in app/page.tsx
- [ ] T079 [US2] Rename all `label: 'Live Casino'` → `label: 'Live Games'` in navigation arrays (mobile strips, quick links, sub-nav pills), update desktop `<span>Live Casino</span>` → `<span>Live Games</span>`, and update `trackNav`/`trackPageView` display names in app/casino/page.tsx
- [ ] T080 [US2] Rename all `label: 'Live Casino'` → `label: 'Live Games'` in navigation arrays, update desktop `<span>Live Casino</span>` → `<span>Live Games</span>` in app/navtest/page.tsx

#### Sports pages (all — parallelizable, same pattern in each file)

- [ ] T081 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/page.tsx
- [ ] T082 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/page.tsx
- [ ] T083 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/premier-league/page.tsx
- [ ] T084 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/la-liga/page.tsx
- [ ] T085 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/bundesliga/page.tsx
- [ ] T086 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/serie-a/page.tsx
- [ ] T087 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/ligue-1/page.tsx
- [ ] T088 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/champions-league/page.tsx
- [ ] T089 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/fa-cup/page.tsx
- [ ] T090 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/copa-america/page.tsx
- [ ] T091 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/championship/page.tsx
- [ ] T092 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/league-one/page.tsx
- [ ] T093 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/soccer/mls/page.tsx
- [ ] T094 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/football/page.tsx
- [ ] T095 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/football/nfl/page.tsx
- [ ] T096 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/football/ncaaf/page.tsx
- [ ] T097 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/football/cfl/page.tsx
- [ ] T098 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/football/xfl/page.tsx
- [ ] T099 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/football/usfl/page.tsx
- [ ] T100 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/basketball/page.tsx
- [ ] T101 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/basketball/nba/page.tsx
- [ ] T102 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/basketball/ncaab/page.tsx
- [ ] T103 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/basketball/wnba/page.tsx
- [ ] T104 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/basketball/euroleague/page.tsx
- [ ] T105 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/baseball/page.tsx
- [ ] T106 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/baseball/mlb/page.tsx
- [ ] T107 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/baseball/npb/page.tsx
- [ ] T108 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/baseball/kbo/page.tsx
- [ ] T109 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/hockey/page.tsx
- [ ] T110 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/hockey/nhl/page.tsx
- [ ] T111 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/tennis/page.tsx
- [ ] T112 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/tennis/atp/page.tsx
- [ ] T113 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/tennis/wta/page.tsx
- [ ] T114 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/tennis/grand-slams/page.tsx
- [ ] T115 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/tennis/davis-cup/page.tsx
- [ ] T116 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/tennis/itf/page.tsx
- [ ] T117 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/mma/page.tsx
- [ ] T118 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/mma/ufc/page.tsx
- [ ] T119 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/mma/bellator/page.tsx
- [ ] T120 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/mma/one-championship/page.tsx
- [ ] T121 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/mma/pfl/page.tsx
- [ ] T122 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/mma/lfa/page.tsx
- [ ] T123 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/rugby/page.tsx
- [ ] T124 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/rugby/six-nations/page.tsx
- [ ] T125 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/rugby/premiership/page.tsx
- [ ] T126 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/rugby/super-rugby/page.tsx
- [ ] T127 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/rugby/rugby-world-cup/page.tsx
- [ ] T128 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/rugby/top-14/page.tsx
- [ ] T129 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/volleyball/page.tsx
- [ ] T130 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/volleyball/superliga/page.tsx
- [ ] T131 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/volleyball/fivb/page.tsx
- [ ] T132 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/volleyball/cev/page.tsx
- [ ] T133 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/volleyball/serie-a1/page.tsx
- [ ] T134 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/table-tennis/page.tsx
- [ ] T135 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/table-tennis/wtt-champions/page.tsx
- [ ] T136 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/table-tennis/t2-diamond/page.tsx
- [ ] T137 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/table-tennis/ittf-world-tour/page.tsx
- [ ] T138 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/lacrosse/page.tsx
- [ ] T139 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/lacrosse/pll/page.tsx
- [ ] T140 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/lacrosse/nll/page.tsx
- [ ] T141 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/lacrosse/ncaa/page.tsx
- [ ] T142 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/lacrosse/world-championship/page.tsx
- [ ] T143 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/pool/page.tsx
- [ ] T144 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/pool/mosconi-cup/page.tsx
- [ ] T145 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/pool/us-open/page.tsx
- [ ] T146 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/pool/wpa/page.tsx
- [ ] T147 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/pool/world-pool-masters/page.tsx
- [ ] T148 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/sports/my-feed/page.tsx

#### Other pages

- [ ] T149 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/account/page.tsx
- [ ] T150 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/library/page.tsx
- [ ] T151 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in app/journey-map/page.tsx
- [ ] T152 [P] [US2] Rename `label: 'Live Casino'` → `label: 'Live Games'` in components/design-customizer.tsx

**Checkpoint**: At this point, all navigation touchpoints reading "Live Casino" should now read "Live Games." Verify by running `rg "label: 'Live Casino'" -g '*.tsx'` — should return zero results.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cleanup across all user stories.

- [ ] T153 Run search verification: `rg "label: 'Casino'" -g '*.tsx'` and `rg "label: 'Live Casino'" -g '*.tsx'` return zero results
- [ ] T154 Run search verification: `rg ">Casino</span>" -g '*.tsx'` and `rg ">Live Casino</span>" -g '*.tsx'` return zero results in navigation contexts
- [ ] T155 Visual spot-check on homepage, one sports page, casino page, and account page at desktop and mobile viewports

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
