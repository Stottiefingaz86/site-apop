<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Modified principles:
  - [PRINCIPLE_1_NAME] -> I. Next.js App Router + TypeScript First
  - [PRINCIPLE_2_NAME] -> II. shadcn/ui + Tailwind Token Fidelity
  - [PRINCIPLE_3_NAME] -> III. Component-First Extension
  - [PRINCIPLE_4_NAME] -> IV. Journey Map Instrumentation (APOP)
  - [PRINCIPLE_5_NAME] -> V. Quality Gates and Build Safety
- Added sections:
  - Technology Guardrails
  - Delivery Workflow and Review Requirements
- Removed sections:
  - None
- Templates requiring updates:
  - ✅ /workspace/.specify/templates/plan-template.md (compatible with constitution gates model)
  - ✅ /workspace/.specify/templates/spec-template.md (supports requirements and measurable outcomes)
  - ✅ /workspace/.specify/templates/tasks-template.md (supports traceable, story-based execution)
  - ⚠ pending /workspace/.specify/templates/commands/*.md (directory not present in this repository layout)
- Deferred TODOs:
  - None
-->

# Site APOP Product Constitution

## Core Principles

### I. Next.js App Router + TypeScript First
All production features MUST be implemented within the Next.js App Router codebase and
typed with TypeScript. New work MUST align with existing route organization and shared
project conventions before introducing novel structure.
Rationale: consistent routing and typing reduce integration defects and speed reviews.

### II. shadcn/ui + Tailwind Token Fidelity
UI implementation MUST use existing design tokens and primitives already shipped in
`src/app/globals.css`, `tailwind.config.ts`, and `src/components/ui` (or equivalent
project paths). Teams MUST avoid introducing a parallel visual system.
Rationale: token fidelity preserves brand consistency and prevents style fragmentation.

### III. Component-First Extension
Before creating new UI blocks, contributors MUST search existing app and component
directories for equivalent interaction patterns and extend those components through
props/variants when feasible. One-off duplicate components are prohibited unless a
documented constraint makes extension impossible.
Rationale: extension-first design improves maintainability and visual parity.

### IV. Journey Map Instrumentation (APOP)
Every newly created product block/component that appears in user journeys MUST include
`data-apop-feature-id` on its root element and MUST emit impression/click telemetry
through the tracking pipeline with route context.
Rationale: roadmap performance requires comparable, real-time behavioral metrics.

### V. Quality Gates and Build Safety
Changes MUST pass linting, type checks, and production build validation before merge.
When modifying navigation or high-visibility surfaces, acceptance must include both a
primary path and an edge-condition validation scenario.
Rationale: broad-surface regressions are high impact and must be prevented early.

## Technology Guardrails

- Required stack: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui.
- Data persistence, when needed, MUST use Supabase Postgres through Prisma ORM unless
  an approved exception is recorded in the implementation plan.
- New dependencies MUST be minimized and justified by a gap in the current stack.
- Journey tracking events MUST use the shared endpoint contract:
  `POST /api/tracking/events` with `{ events: [{ featureId, eventType, route?, elementId? }] }`.

## Delivery Workflow and Review Requirements

- All feature work MUST run through spec-driven phases: constitution alignment,
  specification, planning, task generation, and implementation traceability artifacts.
- Specs, plans, and tasks MUST be committed on the feature branch with implementation.
- Reviews MUST verify component reuse search evidence for UI-pattern changes.
- Navigation updates MUST validate wording clarity and parity across desktop/mobile nav
  surfaces where the label appears.

## Governance

This constitution is the highest-priority engineering policy for this repository.
Every pull request MUST include a constitution compliance check in its planning and
review artifacts. Amendments require: (1) documented rationale, (2) updates to
dependent templates/guidance when needed, and (3) semantic version updates:
MAJOR for incompatible governance changes, MINOR for new/expanded principles, PATCH
for clarifications and wording-only improvements.

Compliance reviews are mandatory during planning and before merge. Exceptions must be
explicitly documented in the implementation plan with why the simpler compliant option
was not viable.

**Version**: 1.0.0 | **Ratified**: 2026-04-15 | **Last Amended**: 2026-04-15
