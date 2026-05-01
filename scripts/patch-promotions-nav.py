#!/usr/bin/env python3
"""Add Promotions nav (mobile + desktop + sticky) to sports page.tsx copies."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPORTS = ROOT / "app" / "sports"

# --- Mobile quick links: insert after VIP Rewards row (before Other) ---
MOBILE_A = (
    "{ label: 'VIP Rewards', onClick: () => { trackNav('vip-rewards', 'VIP Rewards'); "
    "trackPageView('vip-rewards', 'VIP Rewards'); openVipDrawer(); setQuickLinksOpen(false); } },\n"
    "                  { label: 'Other'"
)
MOBILE_A_NEW = (
    "{ label: 'VIP Rewards', onClick: () => { trackNav('vip-rewards', 'VIP Rewards'); "
    "trackPageView('vip-rewards', 'VIP Rewards'); openVipDrawer(); setQuickLinksOpen(false); } },\n"
    "                  { label: 'Promotions', onClick: () => { trackNav('promotions', 'Promotions'); "
    "trackPageView('promotions', 'Promotions'); router.push('/promotions'); setQuickLinksOpen(false); } },\n"
    "                  { label: 'Other'"
)

MOBILE_B = (
    "{ label: 'VIP Rewards', onClick: () => { openVipDrawer(); setShowSports(false); "
    "setQuickLinksOpen(false); window.scrollTo(0, 0); } },\n"
    "                  { label: 'Other'"
)
MOBILE_B_NEW = (
    "{ label: 'VIP Rewards', onClick: () => { openVipDrawer(); setShowSports(false); "
    "setQuickLinksOpen(false); window.scrollTo(0, 0); } },\n"
    "                  { label: 'Promotions', onClick: () => { router.push('/promotions'); "
    "setQuickLinksOpen(false); window.scrollTo(0, 0); } },\n"
    "                  { label: 'Other'"
)

MOBILE_C = (
    "{ label: 'VIP Rewards', onClick: () => { openVipDrawer(); setQuickLinksOpen(false); } },\n"
    "                  { label: 'Other'"
)
MOBILE_C_NEW = (
    "{ label: 'VIP Rewards', onClick: () => { openVipDrawer(); setQuickLinksOpen(false); } },\n"
    "                  { label: 'Promotions', onClick: () => { router.push('/promotions'); "
    "setQuickLinksOpen(false); } },\n"
    "                  { label: 'Other'"
)

# --- Desktop: tracked VIP (football only) ---
BLOCK_A_OLD = """                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[100px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "text-white/70 cursor-pointer",
                        showVipRewards && "!text-white"
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        trackNav('vip-rewards', 'VIP Rewards')
                        trackPageView('vip-rewards', 'VIP Rewards')
                        openVipDrawer()
                      }}
                      data-active={showVipRewards}
                      style={{ pointerEvents: 'auto' } as React.CSSProperties}
                    >
                      {showVipRewards && (
                        <motion.div
                          layoutId="sportsNavPill" layout="position"
                          className="absolute inset-0 rounded-small"
                          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        />
                      )}
                      <span className="relative z-10">VIP Rewards</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>"""

BLOCK_A_NEW = """                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[100px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "text-white/70 cursor-pointer",
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        trackNav('vip-rewards', 'VIP Rewards')
                        trackPageView('vip-rewards', 'VIP Rewards')
                        openVipDrawer()
                      }}
                      style={{ pointerEvents: 'auto' } as React.CSSProperties}
                    >
                      <span className="relative z-10">VIP Rewards</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[100px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "text-white/70 cursor-pointer",
                        showVipRewards && "!text-white"
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        trackNav('promotions', 'Promotions')
                        trackPageView('promotions', 'Promotions')
                        setVipDrawerOpen(false)
                        router.push('/promotions')
                      }}
                      data-active={showVipRewards}
                      style={{ pointerEvents: 'auto' } as React.CSSProperties}
                    >
                      {showVipRewards && (
                        <motion.div
                          layoutId="sportsNavPill" layout="position"
                          className="absolute inset-0 rounded-small"
                          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        />
                      )}
                      <span className="relative z-10">Promotions</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>"""

# --- Desktop: default (openVipDrawer only) ---
BLOCK_B_OLD = """                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[100px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "text-white/70 cursor-pointer",
                        showVipRewards && "!text-white"
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        openVipDrawer()
                      }}
                      data-active={showVipRewards}
                      style={{ pointerEvents: 'auto' } as React.CSSProperties}
                    >
                      {showVipRewards && (
                        <motion.div
                          layoutId="sportsNavPill" layout="position"
                          className="absolute inset-0 rounded-small"
                          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        />
                      )}
                      <span className="relative z-10">VIP Rewards</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>"""

BLOCK_B_NEW = """                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[100px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "text-white/70 cursor-pointer",
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        openVipDrawer()
                      }}
                      style={{ pointerEvents: 'auto' } as React.CSSProperties}
                    >
                      <span className="relative z-10">VIP Rewards</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[100px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "text-white/70 cursor-pointer",
                        showVipRewards && "!text-white"
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setVipDrawerOpen(false)
                        router.push('/promotions')
                      }}
                      data-active={showVipRewards}
                      style={{ pointerEvents: 'auto' } as React.CSSProperties}
                    >
                      {showVipRewards && (
                        <motion.div
                          layoutId="sportsNavPill" layout="position"
                          className="absolute inset-0 rounded-small"
                          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        />
                      )}
                      <span className="relative z-10">Promotions</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>"""

STICKY_DISPATCH_OLD = """                      } else if (item.page === 'vipRewards') {
                        if (typeof window !== 'undefined') {
                          window.dispatchEvent(new CustomEvent('vip:open-drawer'))
                        }
                      }
                    }}"""

STICKY_DISPATCH_NEW = """                      } else if (item.page === 'vipRewards') {
                        if (typeof window !== 'undefined') {
                          window.dispatchEvent(new CustomEvent('vip:open-drawer'))
                        }
                      } else if (item.page === 'promotions') {
                        router.push('/promotions')
                      }
                    }}"""

STICKY_ROOT_OLD = """                      } else if (item.page === 'vipRewards') {
                        router.push('/casino?vipRewards=true')
                      }
                    }}"""

STICKY_ROOT_NEW = """                      } else if (item.page === 'vipRewards') {
                        router.push('/casino?vipRewards=true')
                      } else if (item.page === 'promotions') {
                        router.push('/promotions')
                      }
                    }}"""

VIP_REWARDS_ROW = "{ label: 'VIP Rewards', page: 'vipRewards' as const },"
PROMO_ROW = (
    "{ label: 'VIP Rewards', page: 'vipRewards' as const },\n"
    "                { label: 'Promotions', page: 'promotions' as const },"
)

IS_CURRENT_OLD = "const isCurrentPage = item.page === 'sports'"
IS_CURRENT_NEW = """const isCurrentPage =
                  item.page === 'sports' ||
                  (item.page === 'promotions' && showVipRewards)"""


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    orig = text

    # Mobile
    if "{ label: 'Promotions', onClick:" not in text:
        if MOBILE_A in text:
            text = text.replace(MOBILE_A, MOBILE_A_NEW, 1)
        elif MOBILE_B in text:
            text = text.replace(MOBILE_B, MOBILE_B_NEW, 1)
        elif MOBILE_C in text:
            text = text.replace(MOBILE_C, MOBILE_C_NEW, 1)

    text = text.replace(
        "(item.label === 'VIP Rewards' && showVipRewards)",
        "(item.label === 'Promotions' && showVipRewards)",
    )

    # Sticky strip
    if VIP_REWARDS_ROW in text and "page: 'promotions' as const" not in text:
        text = text.replace(VIP_REWARDS_ROW, PROMO_ROW, 1)
    if IS_CURRENT_OLD in text:
        text = text.replace(IS_CURRENT_OLD, IS_CURRENT_NEW, 1)
    if STICKY_ROOT_OLD in text:
        text = text.replace(STICKY_ROOT_OLD, STICKY_ROOT_NEW, 1)
    elif STICKY_DISPATCH_OLD in text:
        text = text.replace(STICKY_DISPATCH_OLD, STICKY_DISPATCH_NEW, 1)

    # Desktop VIP → slim VIP + Promotions
    if BLOCK_A_OLD in text:
        text = text.replace(BLOCK_A_OLD, BLOCK_A_NEW, 1)
    elif BLOCK_B_OLD in text:
        text = text.replace(BLOCK_B_OLD, BLOCK_B_NEW, 1)

    if text != orig:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    changed = []
    for p in sorted(SPORTS.rglob("*.tsx")):
        if patch_file(p):
            changed.append(str(p.relative_to(ROOT)))
    print(f"Patched {len(changed)} files")
    for c in changed:
        print(" ", c)


if __name__ == "__main__":
    main()
