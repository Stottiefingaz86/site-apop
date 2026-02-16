'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PokerRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/casino?poker=true')
  }, [router])

  return null
}
