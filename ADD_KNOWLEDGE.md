# How to Add Knowledge to the Design Assistant Knowledge Base

The knowledge base includes:
- **Agnostic Design System** (from Figma)
- **Processes** (workflows, procedures)
- **Figma Files** (all design system files)

## File Location

All knowledge is stored in: `lib/agent/knowledgeBase.ts`

---

## Project Consistency Skill (BOL Design Main)

Use this section as a strict operating guide so changes stay aligned with the live product.

### 1) Project Setup Snapshot

- Framework: `Next.js 14` with App Router (`app/` directory)
- UI stack: `React`, `TypeScript`, `Tailwind`, `shadcn/radix`, `framer-motion`
- State: `zustand` stores (notably chat and cross-panel behavior)
- Theme/customization: CSS variable-driven brand system in `components/design-customizer.tsx`
- Key product surfaces:
  - `app/page.tsx` (home/casino entry patterns)
  - `app/casino/page.tsx`
  - `app/sports/page.tsx`
  - `app/sports/football/page.tsx`
  - `app/library/page.tsx` (component source-of-truth governance)

### 2) Non-Negotiable Consistency Rules

1. **Never invent UI patterns** when a live equivalent exists.
2. **Source of truth first**: copy structure/behavior from live page files before styling tweaks.
3. **Keep existing interaction language**:
   - motion timing/easing
   - chip/tag/button grammar
   - drawer/panel exclusivity behavior
4. **New pages must keep the live global shell**:
   - main top nav
   - left side nav
   - standard footer
   - default approach: compose from or re-export closest live page shell
5. **Do not introduce new libraries** for solved problems without explicit approval.
6. **Use existing tokens/classes/utility patterns** before creating new ad-hoc styles.
7. **Preserve current event contracts** (custom window events, existing action names).
8. **No database dependency for assistant knowledge** (use in-repo source only).

### 3) Panel/Drawer Safety Rule

This repo enforces panel exclusivity. Follow `.cursor/rules/panel-exclusivity.mdc`:

- Only one major panel open at a time (chat/sidebar/VIP/account/deposit families)
- New panel/drawer work must include close logic for conflicting panels
- If a change touches open/close behavior, verify this rule before finishing

### 4) Component Structure Guidance

- Prefer composition from existing domains:
  - `components/chat/*`
  - `components/account/*`
  - `components/betslip/*`
  - `components/ui/*`
- When adding UI to sports/casino flows:
  - Reuse existing card anatomy (header/meta/status/risk-actions)
  - Keep typography and spacing scale consistent with nearby components
  - Reuse existing icon family (`@tabler/icons-react`) unless already mixed in-file

### 5) Dependency Guardrails

Before adding any dependency:

1. Check if existing stack already solves it (`framer-motion`, Radix, browser APIs, Next APIs).
2. If needed, choose minimal/maintained package and explain why existing tools are insufficient.
3. Verify bundle/runtime impact for mobile-heavy pages (`sports`, `casino`, drawers, overlays).

### 6) Implementation Workflow (Required)

For each new request:

1. **Locate live reference** in `app/*` and `components/*`.
2. **Map exact behavior** (states, events, edge cases, mobile behavior).
3. **Implement with local parity** (same UX language, no made-up variants).
4. **Validate**:
   - desktop + mobile behavior
   - lints/type checks
   - no panel-exclusivity regressions
5. **Document what changed** and why, with file paths.

### 6.1) No-Database Knowledge Mode

- Keep assistant knowledge in code:
  - `lib/agent/knowledgeBase.ts`
- Do not depend on runtime DB sync for assistant answers.
- Treat Supabase setup/migration docs as legacy unless explicitly re-enabled for a new project.

### 7) Definition of Done for UI Tasks

- Matches live visual grammar and interaction style
- No new inconsistency in wording (labels, button casing, status tags)
- No orphaned mock behavior (all actions either functional or intentionally stubbed and labelled)
- No regressions in tab/filter state flows
- Lints clean for edited files

### 8) Add This Skill to the Assistant Knowledge Base

To make the assistant follow this behavior in chat responses as well:

1. Add an `additionalNotes` entry in `lib/agent/knowledgeBase.ts` with these guardrails.
2. Add a short `processes` entry named **"UI Consistency Review"**:
   - Compare against live pages
   - Reuse existing components/tokens
   - Validate motion and panel behavior
   - Confirm no invented designs
3. Restart dev server and test with:
   - "What are the UI consistency rules for this project?"
   - "Before designing a new card, what is our source-of-truth process?"

---

## Adding More Figma Files

When you share a new Figma file, add it to the `figmaFiles` array:

```typescript
figmaFiles: [
  {
    name: 'Your Figma File Name',
    url: 'https://figma.com/design/...',
    description: 'What this file contains',
    contains: ['Components', 'Colors', 'Patterns', 'etc.'],
    lastUpdated: '2024-01-15', // Optional
  },
]
```

Then extract the information from Figma and add it to:
- `colorTokenMap` in `lib/agent/designSystem.ts` (for colors)
- `designSystem.components` (for components)
- `designSystem.patterns` (for patterns)
- Or other relevant sections

## Adding Processes

Add workflows and procedures to the `processes` array:

```typescript
processes: [
  {
    name: 'Design Request Process',
    description: 'How design requests are submitted and processed',
    steps: [
      'Submit request via design request app',
      'Request assigned to designer based on area',
      'Designer creates Figma file',
      'Review and approval',
      'Delivery to product/design teams',
    ],
    areas: ['All'], // or specific areas
    tools: ['Figma', 'Mattermost', 'Craft.io'],
  },
  {
    name: 'Design Review Process',
    description: 'How designs are reviewed and approved',
    steps: [
      'Designer shares Figma file',
      'Design lead reviews design',
      'Feedback provided',
      'Revisions made',
      'Final approval',
    ],
    tools: ['Figma', 'Mattermost'],
  },
  // Add more processes...
]
```

## Adding Additional Notes

Add any other important information:

```typescript
additionalNotes: [
  'Design system is built on MUI v5.15.0',
  'All components must be accessible (WCAG 2.1 AA)',
  'Brand colors can be customized per brand',
  // Add more notes...
]
```

## Extracting Information from Figma

### Method 1: Figma Desktop (Recommended)

1. Open your Figma file in Figma Desktop
2. Make sure it's the active tab
3. Tell me the file is open and I'll extract:
   - Color tokens/variables
   - Typography tokens
   - Component information
   - Design patterns
   - Any other design tokens

### Method 2: Manual Extraction

1. Open the Figma file
2. Note down:
   - Color tokens and hex codes
   - Typography styles
   - Component names and variants
   - Design patterns
3. Share the information and I'll add it to the knowledge base

### Method 3: Export from Figma

1. Use Figma Tokens plugin to export tokens as JSON
2. Share the JSON and I'll convert it to the knowledge base format

## Updating After Adding Knowledge

After adding new knowledge:

1. **Restart your dev server** (the knowledge base is loaded at startup)
2. **Test with the assistant** - Ask questions about the new information
3. **Verify accuracy** - Make sure responses are correct

## What the Assistant Can Answer

Once knowledge is added, the assistant can answer questions about:

- ✅ Colors (tokens, hex codes, usage)
- ✅ Typography (fonts, sizes, weights, styles)
- ✅ Components (variants, props, usage)
- ✅ Design patterns (when to use, examples)
- ✅ Brands (color palettes, configurations)
- ✅ Processes (steps, tools, ownership workflow)
- ✅ Figma files (what they contain, links)
- ✅ Mockup ideas (using only design system components)

## Example Questions

After adding knowledge, you can ask:

- "What colors does the Casino brand use?"
- "What's the design request process?"
- "Show me a mockup idea for a login page"
- "What components are available?"
- "What Figma files do we have?"

## Need Help?

If you need help adding knowledge:
1. Share the Figma file link
2. Describe what information you want to add
3. I'll extract and add it to the knowledge base
