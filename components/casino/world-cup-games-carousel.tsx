'use client'

import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export type WorldCupGame = {
  id: string
  title: string
  description: string
  ctaLabel: string
  href: string
  event: string
}

const DEFAULT_WORLD_CUP_GAMES: WorldCupGame[] = [
  {
    id: 'penalty-shootout',
    title: 'Penalty Shootout Pro',
    description: 'Pick your corner and score big with boosted odds during knockout fixtures.',
    ctaLabel: 'Play now',
    href: '/casino?game=penalty-shootout-pro',
    event: 'Limited Time',
  },
  {
    id: 'golden-goal',
    title: 'Golden Goal Roulette',
    description: 'Football-themed roulette with lightning multipliers on every extra-time spin.',
    ctaLabel: 'Play now',
    href: '/casino?game=golden-goal-roulette',
    event: 'Hot Match',
  },
  {
    id: 'striker-spins',
    title: 'Striker Spins',
    description: 'Score free spins by landing hat-trick symbols across all reels.',
    ctaLabel: 'Play now',
    href: '/casino?game=striker-spins',
    event: 'Popular',
  },
  {
    id: 'stadium-bonanza',
    title: 'Stadium Bonanza',
    description: 'Build combo streaks and unlock larger bonus pools each round.',
    ctaLabel: 'Learn more',
    href: '/casino?game=stadium-bonanza',
    event: 'New',
  },
  {
    id: 'cup-final-jackpot',
    title: 'Cup Final Jackpot',
    description: 'Progressive jackpot game with match-day challenges and instant wins.',
    ctaLabel: 'Play now',
    href: '/casino?game=cup-final-jackpot',
    event: 'Jackpot',
  },
]

type WorldCupGamesCarouselProps = {
  games?: WorldCupGame[] | null
  isLoading?: boolean
  className?: string
}

function WorldCupGamesLoadingState() {
  return (
    <div className="px-3 md:px-6" aria-live="polite" aria-label="Loading World Cup Games carousel">
      <Carousel className="w-full" opts={{ align: 'start', dragFree: true }}>
        <CarouselContent className="-ml-2 md:-ml-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="pl-2 md:pl-3 basis-[85%] sm:basis-1/2 lg:basis-1/3"
              aria-label={`Loading World Cup game item ${index + 1}`}
            >
              <Card className="h-full border-border/70 bg-background/60">
                <CardHeader className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

function WorldCupGamesEmptyState() {
  return (
    <div className="px-3 md:px-6">
      <Card className="border-border/70 bg-background/70">
        <CardHeader>
          <CardTitle className="text-base">World Cup games are warming up</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Check back shortly for new World Cup themed games and promotions.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild size="sm">
            <Link href="/casino">Browse all casino games</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export function WorldCupGamesCarousel({
  games = DEFAULT_WORLD_CUP_GAMES,
  isLoading = false,
  className,
}: WorldCupGamesCarouselProps) {
  const worldCupGames = (games ?? []).slice(0, 5)

  return (
    <section className={cn('space-y-4', className)} aria-labelledby="world-cup-games-heading">
      <div className="px-3 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="world-cup-games-heading"
            className="text-lg font-semibold text-black transition-colors duration-300 dark:text-white"
          >
            World Cup Games
          </h2>
          <Button asChild size="sm" variant="outline" className="rounded-small">
            <Link href="/casino?category=world-cup-games">See all</Link>
          </Button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover limited-time football-inspired games and promotions.
        </p>
      </div>

      <Separator className="bg-border/70" />

      {isLoading ? (
        <WorldCupGamesLoadingState />
      ) : worldCupGames.length === 0 ? (
        <WorldCupGamesEmptyState />
      ) : (
        <div className="px-3 md:px-6">
          <Carousel
            className="w-full"
            opts={{ align: 'start', dragFree: true, containScroll: 'trimSnaps' }}
            aria-label="World Cup Games carousel"
          >
            <CarouselContent className="-ml-2 md:-ml-3">
              {worldCupGames.map((game, index) => (
                <CarouselItem
                  key={game.id}
                  className="pl-2 md:pl-3 basis-[85%] sm:basis-1/2 lg:basis-1/3"
                  aria-label={`World Cup game ${index + 1}: ${game.title}`}
                >
                  <Card className="flex h-full flex-col border-border/70 bg-background/70 transition-transform duration-300 hover:scale-[1.01]">
                    <CardHeader className="space-y-2">
                      <Badge variant="secondary" className="w-fit">
                        {game.event}
                      </Badge>
                      <CardTitle className="text-base">{game.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-muted-foreground">{game.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild size="sm" className="w-full">
                        <Link href={game.href} aria-label={`${game.ctaLabel}: ${game.title}`}>
                          {game.ctaLabel}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              className="hidden h-9 w-9 border-border/70 bg-background/90 md:flex"
              aria-label="Previous World Cup games"
            />
            <CarouselNext
              className="hidden h-9 w-9 border-border/70 bg-background/90 md:flex"
              aria-label="Next World Cup games"
            />
          </Carousel>
        </div>
      )}
    </section>
  )
}
