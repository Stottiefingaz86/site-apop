import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const betId = searchParams.get('betId')
  const betIdsParam = searchParams.get('betIds')

  const betIds = betIdsParam
    ? betIdsParam
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
    : betId
      ? [betId]
      : []

  if (betIds.length === 0) {
    return NextResponse.json({ error: 'Missing betId or betIds' }, { status: 400 })
  }

  // Local mock pass for integration testing.
  // Replace this endpoint with real pass signing (.pkpass + Apple certs) in production.
  const now = new Date().toISOString()
  const mockPassContents = [
    'This is a local mock Apple Wallet pass response.',
    `ticketType=${betIds.length > 1 ? 'bundled_pending_bets' : 'single_bet'}`,
    `betCount=${betIds.length}`,
    `betIds=${betIds.join(',')}`,
    `generatedAt=${now}`,
    'To enable real Wallet adds, return a valid signed .pkpass file.',
  ].join('\n')

  return new NextResponse(mockPassContents, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.apple.pkpass',
      'Content-Disposition': `attachment; filename="pending-bets-${betIds.length}.pkpass"`,
      'Cache-Control': 'no-store',
    },
  })
}
