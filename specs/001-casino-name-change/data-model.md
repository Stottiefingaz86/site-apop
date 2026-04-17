# Data Model: Casino Name Change to Games

**Feature**: Casino Name Change to Games  
**Date**: 2026-04-17

## Entities

### Navigation Item

A conceptual entity — not persisted in a database — representing each clickable item in the navigation UI.

| Attribute | Description | Change Impact |
|-----------|-------------|---------------|
| `label` | Display text shown to the user (e.g., "Casino", "Live Casino") | **Changed**: "Casino" → "Games", "Live Casino" → "Live Games" |
| `page` | Internal page identifier (e.g., `'casino'`, `'liveCasino'`) | **No change** |
| `product` | Product visibility key (e.g., `'casino'`, `'liveCasino'`) | **No change** |
| `onClick` | Navigation handler / route push | **No change** (routes stay the same) |
| `icon` | Visual icon component (where present) | **No change** |

### Sidebar Menu Item

Used in the left sidebar on some pages.

| Attribute | Description | Change Impact |
|-----------|-------------|---------------|
| `icon` | Tabler icon component | **No change** |
| `label` | Display text (e.g., "Live Casino") | **Changed**: "Live Casino" → "Live Games" |

### Design Customizer Product Toggle

Used in the design customizer component for toggling product visibility.

| Attribute | Description | Change Impact |
|-----------|-------------|---------------|
| `key` | Product identifier (e.g., `'casino'`) | **No change** |
| `label` | Display label (e.g., "Casino") | **Changed**: "Casino" → "Games", "Live Casino" → "Live Games" |

## State Transitions

No state transitions are affected. All navigation state keys (`page: 'casino'`, `product: 'casino'`, `visibleProducts.casino`) remain unchanged. Only the display `label` strings are modified.

## Validation Rules

- Every navigation array that previously contained `label: 'Casino'` must now contain `label: 'Games'`
- Every navigation array that previously contained `label: 'Live Casino'` must now contain `label: 'Live Games'`
- No `label` value should contain "Casino" after the change is complete (within navigation contexts)
- All conditional checks comparing against the label string must be updated to match
