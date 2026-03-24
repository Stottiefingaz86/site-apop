"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { IconChevronLeft, IconChevronRight, IconLoader2 } from "@tabler/icons-react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SportsbookLeague = {
  id: string
  label: string
  href: string
  icon: string
}

const defaultSportsbookLeagues: SportsbookLeague[] = [
  { id: "nfl", label: "NFL", href: "/sports/football/nfl", icon: "/banners/sports_league/NFL.svg" },
  { id: "nba", label: "NBA", href: "/sports/basketball/nba", icon: "/banners/sports_league/nba.svg" },
  { id: "premier-league", label: "Premier League", href: "/sports/soccer/premier-league", icon: "/banners/sports_league/prem.svg" },
  { id: "champions-league", label: "Champions", href: "/sports/soccer/champions-league", icon: "/banners/sports_league/champions.svg" },
  { id: "f1", label: "F1", href: "/sports/football/nfl", icon: "/banners/sports_league/f1.svg" },
  { id: "mlb", label: "MLB", href: "/sports/baseball/mlb", icon: "/banners/sports_league/MLB.svg" },
  { id: "nhl", label: "NHL", href: "/sports/hockey/nhl", icon: "/banners/sports_league/NHL.svg" },
  { id: "mls", label: "MLS", href: "/sports/soccer/mls", icon: "/banners/sports_league/mls.svg" },
  { id: "copa-america", label: "Copa", href: "/sports/soccer/copa-america", icon: "/banners/sports_league/copa.svg" },
  { id: "atp", label: "ATP", href: "/sports/tennis/atp", icon: "/banners/sports_league/ATP.svg" },
]

function fetchSportsbookLeagues(): Promise<SportsbookLeague[]> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(defaultSportsbookLeagues), 500)
  })
}

interface HomepageSportsbookCarouselProps {
  isMobile: boolean
}

export function HomepageSportsbookCarousel({ isMobile }: HomepageSportsbookCarouselProps) {
  const [leagueItems, setLeagueItems] = useState<SportsbookLeague[]>([])
  const [isLoadingLeagues, setIsLoadingLeagues] = useState(true)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const leagueCountLabel = useMemo(() => `${leagueItems.length} leagues`, [leagueItems.length])

  useEffect(() => {
    let isMounted = true

    const loadLeagues = async () => {
      setIsLoadingLeagues(true)
      const data = await fetchSportsbookLeagues()
      if (!isMounted) {
        return
      }
      setLeagueItems(data)
      setIsLoadingLeagues(false)
    }

    loadLeagues()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!carouselApi) {
      return
    }

    const updateScrollState = () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
    }

    updateScrollState()
    carouselApi.on("select", updateScrollState)
    carouselApi.on("reInit", updateScrollState)

    return () => {
      carouselApi.off("select", updateScrollState)
      carouselApi.off("reInit", updateScrollState)
    }
  }, [carouselApi])

  return (
    <section
      aria-label="Sportsbook leagues"
      className={cn("mb-6", isMobile ? "px-3" : "px-6")}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Sportsbook</h2>
        {!isMobile && !isLoadingLeagues && leagueItems.length > 0 && (
          <div className="flex items-center gap-2" aria-label={`Carousel controls for ${leagueCountLabel}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-small bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label="Scroll sportsbook leagues left"
            >
              <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-small bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              aria-label="Scroll sportsbook leagues right"
            >
              <IconChevronRight className="h-4 w-4" strokeWidth={2} />
            </Button>
          </div>
        )}
      </div>

      {isLoadingLeagues ? (
        <div
          role="status"
          aria-live="polite"
          className="flex h-14 items-center justify-center rounded-small border border-white/10 bg-white/[0.03]"
        >
          <IconLoader2 className="mr-2 h-4 w-4 animate-spin text-white/70" />
          <span className="text-sm text-white/70">Loading league icons...</span>
        </div>
      ) : leagueItems.length === 0 ? (
        <div className="flex h-14 items-center justify-center rounded-small border border-white/10 bg-white/[0.03]">
          <span className="text-sm text-white/70">No leagues available right now.</span>
        </div>
      ) : (
        <div className={cn("relative", isMobile ? "-mx-3" : "-mx-6")}>
          <Carousel
            setApi={setCarouselApi}
            className="w-full relative"
            tabIndex={0}
            aria-label="Sportsbook league icon carousel"
            opts={{ dragFree: true, containScroll: "trimSnaps", align: "start", duration: 15 }}
          >
            <CarouselContent className={cn(isMobile ? "ml-3 mr-0" : "ml-6 mr-0")}>
              {leagueItems.map((league, index) => (
                <CarouselItem
                  key={league.id}
                  className={cn(
                    "pr-0 basis-auto flex-shrink-0",
                    index === 0 ? (isMobile ? "pl-3" : "pl-6") : "pl-2 md:pl-4"
                  )}
                >
                  <Link
                    href={league.href}
                    aria-label={`Open ${league.label} sportsbook`}
                    className="group flex h-[58px] min-w-[74px] max-w-[110px] flex-col items-center justify-center rounded-small border border-white/10 bg-white/[0.03] px-3 transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 md:h-[62px] md:min-w-[84px]"
                  >
                    <Image
                      src={league.icon}
                      alt={league.label}
                      width={24}
                      height={24}
                      className="h-6 w-6 object-contain"
                      unoptimized
                    />
                    <span className="mt-1 line-clamp-1 text-center text-[10px] font-medium text-white/90 md:text-[11px]">
                      {league.label}
                    </span>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </section>
  )
}
