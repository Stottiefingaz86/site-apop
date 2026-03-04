"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { IconBellRinging, IconCheck, IconCrown, IconTrash } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

type NotificationItem = {
  id: string
  title: string
  description: string
  timeLabel: string
  unread: boolean
  type?: "default" | "vip-progress" | "vip-cash" | "feature-cta" | "reward-cta"
  progressLabel?: string
  progressValue?: number
  ctaLabel?: string
  ctaAction?: "claim_reward" | "open_vip_benefits" | "launch_game_of_week" | "open_poker"
}

const STORAGE_KEY = "bol-notification-hub-v3"

function resolveProgressDefaults(item: NotificationItem): { progressValue: number; progressLabel: string } {
  if (typeof item.progressValue === "number" && item.progressLabel) {
    return { progressValue: item.progressValue, progressLabel: item.progressLabel }
  }

  if (item.title.toLowerCase().includes("can't stop now")) {
    return { progressValue: 94, progressLabel: "Diamond I to Black II" }
  }
  if (item.title.toLowerCase().includes("awesome")) {
    return { progressValue: 82, progressLabel: "Gold to Platinum I" }
  }
  return { progressValue: 62, progressLabel: "Gold to Platinum I" }
}

function hydrateNotificationTemplates(item: NotificationItem): NotificationItem {
  const hasProgressToken =
    /\{\{\s*CustomerVIPLevelProgress\s*\}\}/i.test(item.title) ||
    /\{\{\s*CustomerVIPLevelProgress\s*\}\}/i.test(item.description)

  const defaults = resolveProgressDefaults(item)
  const progressValue =
    typeof item.progressValue === "number" ? item.progressValue : defaults.progressValue
  const progressLabel = item.progressLabel ?? defaults.progressLabel
  const currentLevel = progressLabel.split(" to ")[0] ?? "Gold"
  const nextLevel = progressLabel.split(" to ")[1] ?? "Platinum I"

  const replaceTokens = (value: string) =>
    value
      .replace(/\{\{\s*CustomerVIPLevelProgress\s*\}\}/g, String(progressValue))
      .replace(/\{\{\s*CustomerVIPLevelNext\s*\}\}/g, nextLevel)
      .replace(/\{\{\s*Level\s*\}\}/g, currentLevel)
      .replace(/\$\{\{\s*Amount1\s*\}\}/g, "250")
      .replace(/\$\{\{\s*Amount\s*\}\}/g, "250")
      .replace(/\{\{\s*Amount\s*\}\}/g, "250")
      .replace(/\{\{\s*CashFreeBet\s*\}\}/g, "Cash Bonus")
      .replace(/\{\{\s*PromoTitle\s*\}\}/g, "VIP Reward")
      .replace(/\{\{\s*rank\s*\}\}/g, "3")
      .replace(/\{\{\s*prize\s*\}\}/g, "500")

  return {
    ...item,
    title: replaceTokens(item.title),
    description: replaceTokens(item.description),
    type: hasProgressToken ? "vip-progress" : item.type,
    progressValue: hasProgressToken ? progressValue : item.progressValue,
    progressLabel: hasProgressToken ? progressLabel : item.progressLabel,
  }
}

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1",
    title: "Your Casino Reward Awaits!",
    description:
      "Click below to claim now. No deposit required, no hidden terms, and no rollover. Your Free Cash expires in 5 days.",
    timeLabel: "Aug 07, 2025",
    unread: true,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-2",
    title: "You've scored a Free Bet in our Sportsbook",
    description:
      "Claim it now. No deposit required, no hidden terms, and no rollover requirements. Your Free Bet expires in 5 days.",
    timeLabel: "Aug 07, 2025",
    unread: true,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-3",
    title: "New to Sports?",
    description: "Your entry to the action is one click away. Claim your Free Bet and start betting.",
    timeLabel: "Aug 07, 2025",
    unread: true,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-4",
    title: "New to Casino?",
    description: "Your adventure starts now. Redeem your free cash boost with no strings attached.",
    timeLabel: "Aug 07, 2025",
    unread: true,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-5",
    title: "Collect Your Poker Tournament Tickets",
    description:
      "1) Open Poker, 2) Cashier > Promo Code, 3) Enter WINDFALLS, 4) Redeem from Cashier > View Tickets.",
    timeLabel: "Aug 07, 2025",
    unread: true,
    ctaLabel: "View tickets",
    ctaAction: "open_poker",
  },
  {
    id: "n-6",
    title: "Collect Your Courtesy Racebook Bet",
    description:
      "We've credited a $5 courtesy bet. Pick your track, back your horse, and cheer it home to the finish line.",
    timeLabel: "Aug 07, 2025",
    unread: true,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-7",
    title: "Countdown Started - Don't Miss Out!",
    description: "Free funds were added to your account with no strings attached. Redeem now.",
    timeLabel: "Aug 07, 2025",
    unread: true,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-8",
    title: "Your Exclusive Reward is Ready to Claim",
    description:
      "Claim now. No deposit required, no hidden terms, no rollover. Your Free Casino Cash expires in 5 days.",
    timeLabel: "Aug 07, 2025",
    unread: true,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-9",
    title: "New to Poker? Claim These Tickets",
    description:
      "Visit Poker, hit Download/Play Online, then Cashier > Promo Code and enter POKERNOW. Click View Tickets.",
    timeLabel: "Aug 07, 2025",
    unread: false,
    ctaLabel: "View tickets",
    ctaAction: "open_poker",
  },
  {
    id: "n-10",
    title: "Free Bet at the Sportsbook",
    description: "Keep the action going! Your account has been awarded a Free Bet for your next wager.",
    timeLabel: "Sep 17, 2025",
    unread: false,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-11",
    title: "Free Cash at the Casino",
    description: "Keep the excitement alive! Your account has been awarded Free Cash for your next play.",
    timeLabel: "Sep 17, 2025",
    unread: false,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-12",
    title: "Your Reward is Waiting!",
    description: "You haven't redeemed your bonus yet. Claim it before it expires.",
    timeLabel: "Sep 17, 2025",
    unread: false,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-13",
    title: "Your Reward is About to Expire",
    description: "Your bonus remains unclaimed. Use it before it's gone.",
    timeLabel: "Sep 17, 2025",
    unread: false,
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-14",
    title: "Congratulations!",
    description:
      "Welcome to {{Level}} VIP Status! Your exclusive Level Up Cash Bonus, with no rollover requirements, is now available.",
    timeLabel: "Nov 22, 2024",
    unread: false,
    type: "vip-cash",
    ctaLabel: "Check my benefits",
    ctaAction: "open_vip_benefits",
  },
  {
    id: "n-15",
    title: "Congratulations!",
    description:
      "Welcome to {{Level}} VIP Status. You now have access to your own personal VIP Host.",
    timeLabel: "Nov 22, 2024",
    unread: false,
    ctaLabel: "Check my benefits",
    ctaAction: "open_vip_benefits",
  },
  {
    id: "n-16",
    title: "VIP Progress",
    description: "Congrats on advancing toward Platinum I with 62% progress.",
    timeLabel: "Apr 11, 2025",
    unread: false,
    type: "vip-progress",
    progressLabel: "Gold to Platinum I",
    progressValue: 62,
    ctaLabel: "Check my benefits",
    ctaAction: "open_vip_benefits",
  },
  {
    id: "n-17",
    title: "Awesome!",
    description: "You've reached 82% progress toward Platinum I VIP status.",
    timeLabel: "Apr 11, 2025",
    unread: false,
    type: "vip-progress",
    progressLabel: "Gold to Platinum I",
    progressValue: 82,
    ctaLabel: "Check my benefits",
    ctaAction: "open_vip_benefits",
  },
  {
    id: "n-18",
    title: "Can't Stop Now!",
    description: "You are so close at 94%! Hurry to unlock Black II rewards.",
    timeLabel: "Apr 11, 2025",
    unread: false,
    type: "vip-progress",
    progressLabel: "Diamond I to Black II",
    progressValue: 94,
    ctaLabel: "Check my benefits",
    ctaAction: "open_vip_benefits",
  },
  {
    id: "n-19",
    title: "Daily Cash Race Winner!",
    description: "You've claimed the #{{rank}} spot and won ${{prize}} in Cash!",
    timeLabel: "Jun 24, 2024",
    unread: false,
  },
  {
    id: "n-20",
    title: "Game of the Week is live! 🎮",
    description: "Jump into this week's featured casino title and test your luck.",
    timeLabel: "Today",
    unread: false,
    type: "feature-cta",
    ctaLabel: "Launch game",
    ctaAction: "launch_game_of_week",
  },
  {
    id: "n-21",
    title: "Claim your level-up reward",
    description: "Your VIP level-up reward is ready. Claim now to move your balance up instantly.",
    timeLabel: "Today",
    unread: false,
    type: "reward-cta",
    ctaLabel: "Claim reward",
    ctaAction: "claim_reward",
  },
  {
    id: "n-22",
    title: "Collect Your Poker Tournament Tickets",
    description: "Enjoy an exclusive promo code that unlocks free tournament tickets!",
    timeLabel: "Aug 07, 2025",
    unread: false,
    ctaLabel: "View tickets",
    ctaAction: "open_poker",
  },
  {
    id: "n-23",
    title: "Reward Successfully Claimed",
    description:
      "${{Amount}} ${{CashFreeBet}} has been credited to your account as part of the promotion.",
    timeLabel: "Aug 27, 2024",
    unread: false,
  },
]

export function NotificationHub() {
  const isMobile = useIsMobile()
  const [tab, setTab] = useState<"all" | "unread">("all")
  const [items, setItems] = useState<NotificationItem[]>(() =>
    SEED_NOTIFICATIONS.map(hydrateNotificationTemplates),
  )
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as NotificationItem[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        setItems(parsed.map(hydrateNotificationTemplates))
      }
    } catch {
      // Ignore malformed local storage.
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const unreadCount = useMemo(() => items.filter((item) => item.unread).length, [items])
  const filteredItems = useMemo(
    () => (tab === "unread" ? items.filter((item) => item.unread) : items),
    [items, tab],
  )
  const allFilteredSelected =
    filteredItems.length > 0 && filteredItems.every((item) => selectedIds.has(item.id))
  const hasSelection = selectedIds.size > 0

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const deleteSelected = () => {
    if (!hasSelection) return
    setItems((prev) => prev.filter((item) => !selectedIds.has(item.id)))
    setSelectedIds(new Set())
  }

  const toggleSelectAllFiltered = () => {
    if (filteredItems.length === 0) return
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (allFilteredSelected) {
        filteredItems.forEach((item) => next.delete(item.id))
      } else {
        filteredItems.forEach((item) => next.add(item.id))
      }
      return next
    })
  }

  const openVipBenefits = () => {
    if (typeof window === "undefined") return
    window.dispatchEvent(new CustomEvent("notification:open-vip-benefits"))
  }

  const launchGameOfWeek = () => {
    if (typeof window === "undefined") return
    window.dispatchEvent(
      new CustomEvent("notification:launch-game-of-week", {
        detail: {
          game: {
            title: "Game of the Week",
            image: "/banners/casino/casino_banner1.svg",
            provider: "Dragon Gaming",
            features: ["Weekly featured title", "Bonus rounds enabled"],
          },
        },
      }),
    )
  }

  const claimReward = (id: string) => {
    const amount = 250
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("notification:claim-reward", {
          detail: { amount },
        }),
      )
    }
    setItems((prev) => [
      {
        id: `claimed-${Date.now()}`,
        title: "Reward Successfully Claimed",
        description: `$${amount.toFixed(2)} has been credited to your account as part of the promotion.`,
        timeLabel: "just now",
        unread: false,
      },
      ...prev.filter((item) => item.id !== id),
    ])
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const notificationCtaClass =
    "mt-3 h-9 rounded-small border border-gray-300 bg-white px-5 text-sm font-semibold !text-gray-800 hover:bg-gray-50 hover:!text-gray-800 active:bg-gray-100"

  const resolveCta = (
    item: NotificationItem,
  ): { label: string; action: NonNullable<NotificationItem["ctaAction"]> } | null => {
    if (item.ctaLabel && item.ctaAction) {
      return { label: item.ctaLabel, action: item.ctaAction }
    }
    if (item.type === "vip-progress" || item.type === "vip-cash") {
      return { label: "Check my benefits", action: "open_vip_benefits" }
    }
    if (item.type === "feature-cta") {
      return { label: "Launch game", action: "launch_game_of_week" }
    }
    if (item.type === "reward-cta") {
      return { label: "Claim reward", action: "claim_reward" }
    }
    if (item.title.toLowerCase().includes("poker tournament tickets")) {
      return { label: "View tickets", action: "open_poker" }
    }
    return null
  }

  const runCta = (item: NotificationItem, action: NonNullable<NotificationItem["ctaAction"]>) => {
    if (action === "claim_reward") {
      claimReward(item.id)
      return
    }
    if (action === "open_vip_benefits") {
      openVipBenefits()
      return
    }
    if (action === "launch_game_of_week") {
      launchGameOfWeek()
      return
    }
    if (action === "open_poker") {
      if (typeof window !== "undefined") window.location.href = "/poker"
    }
  }

  return (
    <div className="mb-2">
      <div className="mb-4 flex flex-col gap-2">
        <div className="inline-flex w-fit max-w-full items-center rounded-full bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setTab("all")}
            className={cn(
              "inline-flex h-8 min-w-[90px] items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors appearance-none focus:outline-none",
              tab === "all"
                ? "bg-[var(--ds-primary,#ee3536)] text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900",
            )}
          >
            <span>All</span>
            <span className={cn(
              "inline-flex h-6 min-w-[24px] items-center justify-center rounded-full px-1.5 text-xs leading-none",
              tab === "all" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
            )}>
              {items.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTab("unread")}
            className={cn(
              "inline-flex h-8 min-w-[90px] items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors appearance-none focus:outline-none",
              tab === "unread"
                ? "bg-[var(--ds-primary,#ee3536)] text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900",
            )}
          >
            <span>Unread</span>
            <span className={cn(
              "inline-flex h-6 min-w-[24px] items-center justify-center rounded-full px-1.5 text-xs leading-none",
              tab === "unread" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
            )}>
              {unreadCount}
            </span>
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <Button
            variant="ghost"
            className="h-7 px-2 text-[11px] text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            onClick={toggleSelectAllFiltered}
          >
            {allFilteredSelected ? "Unselect All" : "Select All"}
          </Button>
          <Button
            variant="ghost"
            className="h-7 px-2 text-[11px] text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
            disabled={!hasSelection}
            onClick={deleteSelected}
          >
            Delete Selected
          </Button>
        </div>
      </div>

      <div className="space-y-2 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            (() => {
              const cta = resolveCta(item)
              return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "relative overflow-hidden rounded-small border border-gray-200 bg-gray-50 p-4",
                item.unread && "bg-gray-50",
              )}
              onTouchStart={(e) => {
                if (!isMobile) return
                const touch = e.touches[0]
                const el = e.currentTarget
                el.dataset.startX = touch.clientX.toString()
                el.dataset.startY = touch.clientY.toString()
                el.dataset.swiping = "false"
              }}
              onTouchMove={(e) => {
                if (!isMobile) return
                const el = e.currentTarget
                const startX = parseFloat(el.dataset.startX || "0")
                const startY = parseFloat(el.dataset.startY || "0")
                const touch = e.touches[0]
                const dx = touch.clientX - startX
                const dy = touch.clientY - startY
                if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.4) {
                  el.dataset.swiping = "true"
                  e.stopPropagation()
                  const inner = el.querySelector("[data-notification-inner]") as HTMLElement | null
                  const reveal = el.querySelector("[data-notification-remove]") as HTMLElement | null
                  if (inner && dx < 0) {
                    const clamped = Math.max(dx, -112)
                    inner.style.transform = `translateX(${clamped}px)`
                    inner.style.transition = "none"
                    if (reveal) reveal.style.opacity = `${Math.min(1, Math.abs(dx) / 60)}`
                  }
                }
              }}
              onTouchEnd={(e) => {
                if (!isMobile) return
                const el = e.currentTarget
                const startX = parseFloat(el.dataset.startX || "0")
                const touch = e.changedTouches[0]
                const dx = touch.clientX - startX
                const inner = el.querySelector("[data-notification-inner]") as HTMLElement | null
                const reveal = el.querySelector("[data-notification-remove]") as HTMLElement | null
                if (inner) {
                  if (dx < -76) {
                    inner.style.transition = "transform 0.2s ease-out"
                    inner.style.transform = "translateX(-100%)"
                    window.setTimeout(() => removeItem(item.id), 200)
                  } else {
                    inner.style.transition = "transform 0.2s ease-out"
                    inner.style.transform = "translateX(0)"
                    if (reveal) reveal.style.opacity = "0"
                  }
                }
              }}
            >
              {isMobile && (
                <div
                  data-notification-remove
                  className="pointer-events-none absolute inset-y-0 right-0 flex w-28 items-center justify-center bg-red-500/90 text-white opacity-0 transition-opacity"
                >
                  <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide">
                    <IconTrash className="h-4 w-4" />
                    Remove
                  </div>
                </div>
              )}

              <div data-notification-inner className="relative z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-7 w-7 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                  onClick={() => removeItem(item.id)}
                >
                  <IconTrash className="h-4 w-4" />
                </Button>

                <div className="flex items-start gap-3 pr-8">
                <button
                  type="button"
                  onClick={() => toggleSelected(item.id)}
                  className={cn(
                    "mt-0.5 h-4.5 w-4.5 rounded-md border transition-colors",
                    selectedIds.has(item.id)
                      ? "border-[#ee3536] bg-[#ee3536]"
                      : "border-gray-300 bg-white hover:border-gray-400",
                  )}
                >
                  {selectedIds.has(item.id) && <IconCheck className="mx-auto h-3 w-3 text-white" />}
                </button>
                <div className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", item.unread ? "bg-[#ee3536]" : "bg-gray-300")} />

                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-base font-semibold text-gray-900">
                    {item.type === "vip-cash" && <IconCrown className="h-4 w-4 text-[#c4ad30]" />}
                    <span>{item.title}</span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.description}</p>

                  {item.type === "vip-progress" && (
                    <div className="mt-3 rounded-small bg-gray-100 p-3.5">
                      <div className="mb-2 text-sm font-semibold text-gray-700">
                        {item.progressLabel ?? "Gold to Platinum I"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={item.progressValue ?? 45} className="h-2 bg-gray-200 [&>div]:bg-[#c4ad30]" />
                        <span className="text-sm font-semibold text-gray-600">{item.progressValue ?? 45}%</span>
                      </div>
                    </div>
                  )}

                  {cta && (
                    <Button
                      variant="ghost"
                      onClick={() => runCta(item, cta.action)}
                      className={notificationCtaClass}
                    >
                      {cta.label}
                    </Button>
                  )}

                  <p className="mt-2 text-xs text-gray-400">{item.timeLabel}</p>
                </div>
                </div>
              </div>
            </motion.div>
              )
            })()
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <div className="mt-8 rounded-small border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
          <IconBellRinging className="mx-auto mb-2 h-5 w-5 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">No notifications</p>
          <p className="mt-1 text-xs text-gray-500">You are all caught up.</p>
        </div>
      )}
    </div>
  )
}

