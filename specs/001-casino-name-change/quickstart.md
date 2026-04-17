# Quickstart: Casino Name Change to Games

**Feature**: Casino Name Change to Games  
**Date**: 2026-04-17

## Verification Steps

### Step 1: Search for Remaining "Casino" Labels

After implementation, run a search to verify no navigation labels still say "Casino":

```bash
# Should return ZERO matches in navigation label contexts
rg "label: 'Casino'" --type tsx app/ components/
rg "label: 'Live Casino'" --type tsx app/ components/

# Check for desktop button text
rg ">Casino</span>" --type tsx app/ components/
rg ">Live Casino</span>" --type tsx app/ components/
```

### Step 2: Verify New Labels Exist

```bash
# Should match ~73 files each
rg "label: 'Games'" --type tsx app/ components/
rg "label: 'Live Games'" --type tsx app/ components/
```

### Step 3: Visual Verification — Desktop

1. Open the homepage (`/`) in a browser
2. Verify the top navigation bar shows "Games" where it previously showed "Casino"
3. Verify "Live Games" where it previously showed "Live Casino"
4. Click "Games" — confirm it navigates to `/casino`
5. Click "Live Games" — confirm it navigates to `/casino?tab=live` (or equivalent)

### Step 4: Visual Verification — Mobile

1. Open any page in a mobile viewport (or responsive dev tools)
2. Open the quick-links / hamburger menu
3. Verify "Games" and "Live Games" labels
4. Tap each — confirm correct routing

### Step 5: Cross-Page Verification

Visit at least 3 different page types to confirm consistency:
- Homepage (`/`)
- A sports page (e.g., `/sports/soccer/premier-league`)
- The casino/games page (`/casino`)
- Account page (`/account`)

### Step 6: Sidebar Verification

1. On desktop, check the left sidebar (visible on some pages)
2. Verify "Live Casino" has been updated to "Live Games" in sidebar items

## Common Issues

- **Missed file**: A sports sub-league page was missed. Run the search in Step 1 to catch any stragglers.
- **Broken conditional**: `item.label === 'Casino'` was not updated alongside the label, causing active-state highlighting to break. Ensure all conditional checks are updated.
- **Analytics mismatch**: The `trackNav` display name was not updated, causing analytics reports to show old label. The second argument should be updated; the first (slug) should not.
