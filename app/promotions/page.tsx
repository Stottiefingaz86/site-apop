'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function PromotionsRedirectInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const section = searchParams.get('section')
    const url = section
      ? `/casino?vipRewardsPage=true&section=${encodeURIComponent(section)}`
      : '/casino?vipRewardsPage=true'
    router.replace(url)
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white/30" />
    </div>
  )
}

export default function PromotionsRedirect() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white/30" />
        </div>
      }
    >
      <PromotionsRedirectInner />
    </Suspense>
  )
}
