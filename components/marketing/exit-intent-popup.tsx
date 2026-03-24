"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useTrackingStore } from "@/lib/store/trackingStore"

type ApopEventType = "impression" | "click"

interface ApopTrackingEvent {
  featureId: string
  eventType: ApopEventType
  route?: string
  elementId?: string
}

const FEATURE_ID = "cmn4ktng40000ddi8ax3mb9nm"
const SESSION_DISMISS_KEY = "apop-exit-intent-dismissed"
const TOP_THRESHOLD = 16

function normalizePage(pathname: string): string {
  if (!pathname || pathname === "/") return "home"
  return pathname.replace(/^\/+/, "")
}

export function ExitIntentPopup() {
  const pathname = usePathname()
  const router = useRouter()
  const track = useTrackingStore((state) => state.track)

  const [isOpen, setIsOpen] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  const hasTriggeredRef = useRef(false)
  const hasTrackedImpressionRef = useRef(false)
  const hasDismissedRef = useRef(false)
  const previousYRef = useRef<number | null>(null)

  const sendApopEvents = useCallback(async (events: ApopTrackingEvent[]) => {
    try {
      await fetch("/api/tracking/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ events }),
      })
    } catch {
      // Keep UX uninterrupted when tracking is unavailable.
    }
  }, [])

  const trackApopEvent = useCallback(
    (eventType: ApopEventType, elementId?: string) => {
      const route = pathname || "/"

      void sendApopEvents([
        {
          featureId: FEATURE_ID,
          eventType,
          route,
          elementId,
        },
      ])

      track({
        type: eventType === "click" ? "cta_click" : "action",
        page: normalizePage(route),
        target: elementId || `exit-intent-${eventType}`,
        label: "Exit Intent Popup",
        meta: {
          featureId: FEATURE_ID,
          eventType,
          route,
          ...(elementId ? { elementId } : {}),
        },
      })
    },
    [pathname, sendApopEvents, track]
  )

  const markDismissed = useCallback(() => {
    hasDismissedRef.current = true
    setIsDismissed(true)
    setIsOpen(false)
    try {
      sessionStorage.setItem(SESSION_DISMISS_KEY, "true")
    } catch {
      // Ignore storage errors and keep best-effort behavior.
    }
  }, [])

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(SESSION_DISMISS_KEY) === "true"
      setIsDismissed(dismissed)
    } catch {
      setIsDismissed(false)
    }
  }, [])

  useEffect(() => {
    if (hasTrackedImpressionRef.current) return
    hasTrackedImpressionRef.current = true
    trackApopEvent("impression", "exit-intent-popup")
  }, [trackApopEvent])

  useEffect(() => {
    if (isDismissed) return
    if (typeof window === "undefined") return

    const isFinePointer = window.matchMedia("(pointer: fine)").matches
    if (!isFinePointer) return

    const openOnce = () => {
      if (hasTriggeredRef.current || isDismissed) return
      hasTriggeredRef.current = true
      setIsOpen(true)
    }

    const handleMouseMove = (event: MouseEvent) => {
      const previousY = previousYRef.current
      previousYRef.current = event.clientY
      if (event.clientY > TOP_THRESHOLD) return
      if (previousY === null || event.clientY < previousY) {
        openOnce()
      }
    }

    const handleMouseOut = (event: MouseEvent) => {
      const leavingWindow = event.relatedTarget === null
      if (leavingWindow && event.clientY <= TOP_THRESHOLD) {
        openOnce()
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseout", handleMouseOut)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseout", handleMouseOut)
    }
  }, [isDismissed])

  useEffect(() => {
    const handleChatOpened = () => setIsOpen(false)
    window.addEventListener("panel:chat-opened", handleChatOpened)
    return () => window.removeEventListener("panel:chat-opened", handleChatOpened)
  }, [])

  const onClaimOffer = () => {
    trackApopEvent("click", "exit-intent-claim-offer")
    markDismissed()
    router.push("/casino?promo=before-you-go")
  }

  const onDismiss = () => {
    trackApopEvent("click", "exit-intent-dismiss")
    markDismissed()
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && isOpen && !hasDismissedRef.current) {
          onDismiss()
          return
        }
        setIsOpen(open)
      }}
    >
      <SheetContent
        side="bottom"
        className="border-white/10 bg-[#1a1a1a] sm:max-w-none"
        aria-describedby="exit-intent-description"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Before you go</SheetTitle>
          <SheetDescription id="exit-intent-description">
            Limited-time promotion for visitors about to leave.
          </SheetDescription>
        </SheetHeader>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="mx-auto w-full max-w-xl"
          data-apop-feature-id={FEATURE_ID}
        >
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-xl text-white">Before you go...</CardTitle>
              <CardDescription className="text-white/70">
                Grab this limited offer and start with extra value today.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-medium text-white">Up to $250 Welcome Bonus</p>
                <p className="mt-1 text-xs text-white/65">
                  Deposit now and unlock your bonus plus fast access to featured games.
                </p>
              </div>
              <Separator className="bg-white/10" />
            </CardContent>
            <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="w-full border-white/20 bg-transparent text-white hover:bg-white/10 sm:w-auto"
                onClick={onDismiss}
                aria-label="Dismiss exit intent offer"
              >
                No thanks
              </Button>
              <Button
                className="w-full bg-[var(--ds-primary,#ee3536)] text-[var(--ds-primary-text,#fff)] hover:opacity-90 sm:w-auto"
                onClick={onClaimOffer}
                aria-label="Claim offer from exit intent popup"
              >
                Claim Offer
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </SheetContent>
    </Sheet>
  )
}
