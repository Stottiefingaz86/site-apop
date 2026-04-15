"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

const DEFAULT_FEATURE_ID = "cmnja5p59000pddpqzzxhmxz4"

export type SportsLeagueRailItem = {
  id: string
  name: string
  sport: string
  icon: string
  href: string
  elementId?: string
}

type SportsLeagueCarouselRailProps = {
  title: string
  items: SportsLeagueRailItem[]
  variant?: "default" | "compact"
  viewAllHref?: string
  viewAllLabel?: string
  className?: string
  featureId?: string
  onLeagueClick?: (item: SportsLeagueRailItem) => void
  onImpression?: () => void
}

type ApopEventPayload = {
  featureId: string
  eventType: "impression" | "click"
  route?: string
  elementId?: string
}

async function sendApopEvent(events: ApopEventPayload[]) {
  try {
    await fetch("/api/tracking/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events }),
    })
  } catch {
    // Keep UI responsive if analytics transport fails.
  }
}

export function SportsLeagueCarouselRail({
  title,
  items,
  variant = "default",
  viewAllHref = "/sports",
  viewAllLabel = "View All",
  className,
  featureId = DEFAULT_FEATURE_ID,
  onLeagueClick,
  onImpression,
}: SportsLeagueCarouselRailProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const hasTrackedImpression = useRef(false)

  useEffect(() => {
    if (!carouselApi) return

    const updateState = () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
    }

    updateState()
    carouselApi.on("select", updateState)
    carouselApi.on("reInit", updateState)

    return () => {
      carouselApi.off("select", updateState)
      carouselApi.off("reInit", updateState)
    }
  }, [carouselApi])

  useEffect(() => {
    if (hasTrackedImpression.current) return
    hasTrackedImpression.current = true

    onImpression?.()
    void sendApopEvent([
      {
        featureId,
        eventType: "impression",
        route: pathname,
        elementId: "sports-league-carousel",
      },
    ])
  }, [featureId, onImpression, pathname])

  const handleNavigate = useCallback(
    (item: SportsLeagueRailItem) => {
      onLeagueClick?.(item)
      void sendApopEvent([
        {
          featureId,
          eventType: "click",
          route: pathname,
          elementId: item.elementId || `sports-league-${item.id}`,
        },
      ])
      router.push(item.href)
    },
    [featureId, onLeagueClick, pathname, router]
  )

  const cardWidthClass = variant === "compact" ? "w-[124px]" : "w-[140px]"
  const cardHeightClass = variant === "compact" ? "h-[116px]" : "h-[128px]"
  const handleViewAll = useCallback(() => {
    void sendApopEvent([
      {
        featureId,
        eventType: "click",
        route: pathname,
        elementId: "sports-league-view-all",
      },
    ])
    router.push(viewAllHref)
  }, [featureId, pathname, router, viewAllHref])

  return (
    <section
      data-apop-feature-id={featureId}
      className={cn("mb-6", className)}
      aria-label={title}
    >
      <div className="flex items-center justify-between mb-4 px-3 md:px-6">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/5 text-xs px-3 py-1.5 h-auto border border-white/20 rounded-small"
            onClick={handleViewAll}
          >
            {viewAllLabel}
          </Button>
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-small bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!carouselApi || !canScrollPrev}
              aria-label="Scroll leagues left"
            >
              <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-small bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!carouselApi || !canScrollNext}
              aria-label="Scroll leagues right"
            >
              <IconChevronRight className="h-4 w-4" strokeWidth={2} />
            </Button>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="px-3 md:px-6">
          <div className="rounded-small border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            No leagues are available right now. Try the full sportsbook.
          </div>
        </div>
      ) : (
        <div className="relative -mx-3 md:-mx-6">
          <Carousel
            setApi={setCarouselApi}
            className="w-full relative"
            opts={{ dragFree: true, containScroll: "trimSnaps", duration: 15 }}
          >
            <CarouselContent className="ml-3 mr-0 md:ml-6 md:mr-0">
              {items.map((item, index) => (
                <CarouselItem
                  key={item.id}
                  className={cn(
                    "pr-0 basis-auto flex-shrink-0",
                    index === 0 ? "pl-3 md:pl-6" : "pl-2 md:pl-4"
                  )}
                >
                  <button
                    id={item.elementId}
                    type="button"
                    onClick={() => handleNavigate(item)}
                    className={cn(
                      cardWidthClass,
                      cardHeightClass,
                      "rounded-small border border-white/10 bg-white/5 hover:bg-white/10 transition-colors p-3 text-left flex flex-col justify-between"
                    )}
                  >
                    <div className="relative h-8 w-8">
                      <Image
                        src={item.icon}
                        alt={item.name}
                        fill
                        className="object-contain"
                        unoptimized
                        sizes="32px"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white leading-tight">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-white/60">{item.sport}</div>
                    </div>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </section>
  )
}
