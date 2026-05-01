#!/usr/bin/env node
// Roll the SidebarPromos block out across every page that has the
// Loyalty/Banking/Need-Help bottom block.  Idempotent: skips files that
// already have the import.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const PROMOS_IMPORT = "import { SidebarPromos } from '@/components/sidebar-promos'"

// Pattern that triggers update — these inline rows or the menu-list trio.
const FILES = [
  // every file currently rendering `IconCrown … Loyalty Hub` in JSX
  'app/page.tsx',
  'app/account/page.tsx',
  'app/library/page.tsx',
  'app/navtest/page.tsx',
  // sports
  'app/sports/page.tsx',
  'app/sports/my-feed/page.tsx',
  // baseball
  'app/sports/baseball/page.tsx',
  'app/sports/baseball/mlb/page.tsx',
  'app/sports/baseball/npb/page.tsx',
  'app/sports/baseball/kbo/page.tsx',
  // basketball
  'app/sports/basketball/page.tsx',
  'app/sports/basketball/nba/page.tsx',
  'app/sports/basketball/ncaab/page.tsx',
  'app/sports/basketball/wnba/page.tsx',
  'app/sports/basketball/euroleague/page.tsx',
  // football
  'app/sports/football/page.tsx',
  'app/sports/football/nfl/page.tsx',
  'app/sports/football/cfl/page.tsx',
  'app/sports/football/usfl/page.tsx',
  'app/sports/football/xfl/page.tsx',
  'app/sports/football/ncaaf/page.tsx',
  // hockey
  'app/sports/hockey/page.tsx',
  'app/sports/hockey/nhl/page.tsx',
  // lacrosse
  'app/sports/lacrosse/page.tsx',
  'app/sports/lacrosse/ncaa/page.tsx',
  'app/sports/lacrosse/nll/page.tsx',
  'app/sports/lacrosse/pll/page.tsx',
  'app/sports/lacrosse/world-championship/page.tsx',
  // mma
  'app/sports/mma/page.tsx',
  'app/sports/mma/ufc/page.tsx',
  'app/sports/mma/bellator/page.tsx',
  'app/sports/mma/lfa/page.tsx',
  'app/sports/mma/one-championship/page.tsx',
  'app/sports/mma/pfl/page.tsx',
  // pool
  'app/sports/pool/page.tsx',
  'app/sports/pool/wpa/page.tsx',
  'app/sports/pool/mosconi-cup/page.tsx',
  'app/sports/pool/us-open/page.tsx',
  'app/sports/pool/world-pool-masters/page.tsx',
  // rugby
  'app/sports/rugby/page.tsx',
  'app/sports/rugby/premiership/page.tsx',
  'app/sports/rugby/rugby-world-cup/page.tsx',
  'app/sports/rugby/six-nations/page.tsx',
  'app/sports/rugby/super-rugby/page.tsx',
  'app/sports/rugby/top-14/page.tsx',
  // soccer
  'app/sports/soccer/page.tsx',
  'app/sports/soccer/bundesliga/page.tsx',
  'app/sports/soccer/champions-league/page.tsx',
  'app/sports/soccer/championship/page.tsx',
  'app/sports/soccer/copa-america/page.tsx',
  'app/sports/soccer/fa-cup/page.tsx',
  'app/sports/soccer/la-liga/page.tsx',
  'app/sports/soccer/league-one/page.tsx',
  'app/sports/soccer/ligue-1/page.tsx',
  'app/sports/soccer/mls/page.tsx',
  'app/sports/soccer/premier-league/page.tsx',
  'app/sports/soccer/serie-a/page.tsx',
  // table tennis
  'app/sports/table-tennis/page.tsx',
  'app/sports/table-tennis/ittf-world-tour/page.tsx',
  'app/sports/table-tennis/t2-diamond/page.tsx',
  'app/sports/table-tennis/wtt-champions/page.tsx',
  // tennis
  'app/sports/tennis/page.tsx',
  'app/sports/tennis/atp/page.tsx',
  'app/sports/tennis/wta/page.tsx',
  'app/sports/tennis/itf/page.tsx',
  'app/sports/tennis/davis-cup/page.tsx',
  'app/sports/tennis/grand-slams/page.tsx',
  // volleyball
  'app/sports/volleyball/page.tsx',
  'app/sports/volleyball/cev/page.tsx',
  'app/sports/volleyball/fivb/page.tsx',
  'app/sports/volleyball/serie-a1/page.tsx',
  'app/sports/volleyball/superliga/page.tsx',
]

let updated = 0
let skipped = 0

for (const rel of FILES) {
  const file = path.join(ROOT, rel)
  if (!fs.existsSync(file)) {
    console.log(`SKIP (missing) ${rel}`)
    skipped++
    continue
  }

  let src = fs.readFileSync(file, 'utf8')
  let changed = false
  const before = src

  // 1. Add the SidebarPromos import beside RewardCrates if not present
  if (!src.includes(PROMOS_IMPORT)) {
    if (src.includes("import { RewardCrates } from '@/components/vip/reward-crates'")) {
      src = src.replace(
        "import { RewardCrates } from '@/components/vip/reward-crates'",
        `import { RewardCrates } from '@/components/vip/reward-crates'\n${PROMOS_IMPORT}`
      )
      changed = true
    } else {
      console.log(`SKIP (no RewardCrates anchor) ${rel}`)
      skipped++
      continue
    }
  }

  // 2. Insert SidebarPromos + Separator at every SidebarContent → TooltipProvider boundary.
  //    Also flip overflow-x-hidden on the SidebarContent so the rows clip.
  const SIDEBAR_OPEN_RE =
    /(<SidebarContent\s+className="overflow-y-auto)(\s+flex\s+flex-col">\s*\n\s*<TooltipProvider>)/g

  const promosBlock = `\n                <SidebarPromos\n                  collapsed={sidebarState === 'collapsed' && !isMobile}\n                />\n                <Separator className="bg-white/10 mx-2" />`

  let didInsert = false
  src = src.replace(SIDEBAR_OPEN_RE, (m, open, rest) => {
    didInsert = true
    return `${open} overflow-x-hidden${rest}${promosBlock}`
  })
  if (didInsert) changed = true

  // 3. Strip the Loyalty Hub line from inline bottom-trio arrays.
  //    Matches `{ icon: IconCrown, label: 'Loyalty Hub' },\n` while requiring
  //    Banking on the next non-whitespace line so we don't catch loose entries.
  const LOYALTY_TRIO_RE =
    /^[ \t]*\{\s*icon:\s*IconCrown,\s*label:\s*'Loyalty Hub'\s*\},\s*\n(?=[ \t]*\{\s*icon:\s*IconBuilding,\s*label:\s*'Banking'\s*\},)/gm
  const stripped = src.replace(LOYALTY_TRIO_RE, '')
  if (stripped !== src) {
    src = stripped
    changed = true
  }

  if (changed) {
    fs.writeFileSync(file, src)
    console.log(`UPDATED ${rel}`)
    updated++
  } else {
    console.log(`UNCHANGED ${rel}`)
    skipped++
  }
}

console.log('\n---')
console.log(`Updated: ${updated}`)
console.log(`Skipped: ${skipped}`)
