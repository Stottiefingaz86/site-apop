"use client"

export type CommunityPostType = "discussion" | "bet-share"

export interface CommunityForumPost {
  id: string
  author: string
  source: "community" | "chat"
  type: CommunityPostType
  content: string
  createdAt: string
  betSlip?: {
    type: "single" | "parlay"
    legs: { event: string; selection: string; odds: string }[]
    combinedOdds?: string
    potentialWin?: string
  }
}

export interface CommunityForumReply {
  id: string
  postId: string
  author: string
  content: string
  createdAt: string
}

export const COMMUNITY_FORUM_STORAGE_KEY = "community_forum_posts_v1"
export const COMMUNITY_FORUM_EVENT = "community:post-created"
export const COMMUNITY_FORUM_REPLIES_STORAGE_KEY = "community_forum_replies_v1"
export const COMMUNITY_FORUM_REPLY_EVENT = "community:reply-created"

const seedPosts: CommunityForumPost[] = [
  {
    id: "seed-1",
    author: "Community Manager - Jess",
    source: "community",
    type: "discussion",
    content:
      "Royal Club Originals reward drop is live. Prize pool: $3,000. Opt in and complete your qualifying activity before 9PM ET.",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: "seed-2",
    author: "Community Manager - Alex",
    source: "community",
    type: "discussion",
    content:
      "Daily Race update: leaderboard has reset. Wager in Sportsbook, Casino, Racebook, or Esports to qualify.",
    createdAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
  },
  {
    id: "seed-3",
    author: "Tournament Admin - Mia",
    source: "community",
    type: "discussion",
    content:
      "Weekend Casino Tournament is open: slots + live blackjack entries accepted. Top 20 finishers paid.",
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
  },
  {
    id: "seed-4",
    author: "BigWinBenny",
    source: "community",
    type: "discussion",
    content:
      "Hit a 128x on Megaways and cashed out. Posting screenshot in comments. What are you all running tonight?",
    createdAt: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
  },
  {
    id: "seed-5",
    author: "OddsQueen",
    source: "community",
    type: "bet-share",
    content: "Sharing my Sunday parlay before kickoff.",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    betSlip: {
      type: "parlay",
      legs: [
        { event: "Liverpool vs Bournemouth", selection: "Liverpool ML", odds: "-140" },
        { event: "Arsenal vs Chelsea", selection: "Over 2.5", odds: "-110" },
        { event: "Man City vs Newcastle", selection: "Man City -1", odds: "+105" },
      ],
      combinedOdds: "+560",
      potentialWin: "$132.00",
    },
  },
  {
    id: "seed-6",
    author: "Community Manager - Rina",
    source: "community",
    type: "discussion",
    content:
      "Wednesday AMA is live at 6PM ET. Drop your sportsbook pricing and market questions in this thread.",
    createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
  },
  {
    id: "seed-7",
    author: "StakeTrackerTom",
    source: "community",
    type: "discussion",
    content:
      "Daily race update: moved from #27 to #11 in two sessions. Posting my strategy split between casino and sportsbook.",
    createdAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
  },
  {
    id: "seed-8",
    author: "Community Manager - Jess",
    source: "community",
    type: "discussion",
    content:
      "Friday Fun challenge posted: share your best value leg and your biggest near-miss from this week. Top replies featured tomorrow.",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
]

const seedReplies: CommunityForumReply[] = [
  {
    id: "seed-reply-1",
    postId: "seed-8",
    author: "ParlaySharks",
    content: "Near miss was Arsenal BTTS. Still took profit on two singles.",
    createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
  },
  {
    id: "seed-reply-2",
    postId: "seed-5",
    author: "BigWinBenny",
    content: "I like leg 2 there. Might tail with a smaller stake.",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "seed-reply-3",
    postId: "seed-5",
    author: "Community Manager - Alex",
    content: "Post your result after kickoff - we may feature this in tonight's roundup.",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
]

export function readCommunityForumPosts(): CommunityForumPost[] {
  if (typeof window === "undefined") return seedPosts
  try {
    const raw = localStorage.getItem(COMMUNITY_FORUM_STORAGE_KEY)
    if (!raw) return seedPosts
    const parsed = JSON.parse(raw) as CommunityForumPost[]
    if (!Array.isArray(parsed)) return seedPosts
    return parsed.length > 0 ? parsed : seedPosts
  } catch {
    return seedPosts
  }
}

export function writeCommunityForumPosts(posts: CommunityForumPost[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(COMMUNITY_FORUM_STORAGE_KEY, JSON.stringify(posts))
  } catch {}
}

export function addCommunityForumPost(post: CommunityForumPost) {
  if (typeof window === "undefined") return
  const current = readCommunityForumPosts()
  const next = [post, ...current].slice(0, 300)
  writeCommunityForumPosts(next)
  window.dispatchEvent(new CustomEvent(COMMUNITY_FORUM_EVENT, { detail: post }))
}

export function readCommunityForumReplies(postId?: string): CommunityForumReply[] {
  let replies = seedReplies
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(COMMUNITY_FORUM_REPLIES_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CommunityForumReply[]
        if (Array.isArray(parsed)) replies = parsed
      }
    } catch {}
  }

  const sorted = [...replies].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  if (!postId) return sorted
  return sorted.filter((reply) => reply.postId === postId)
}

export function writeCommunityForumReplies(replies: CommunityForumReply[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(COMMUNITY_FORUM_REPLIES_STORAGE_KEY, JSON.stringify(replies))
  } catch {}
}

export function addCommunityForumReply(reply: CommunityForumReply) {
  if (typeof window === "undefined") return
  const current = readCommunityForumReplies()
  const next = [...current, reply].slice(-800)
  writeCommunityForumReplies(next)
  window.dispatchEvent(new CustomEvent(COMMUNITY_FORUM_REPLY_EVENT, { detail: reply }))
}

export function createCommunityForumReply(input: {
  postId: string
  content: string
  author?: string
}): CommunityForumReply {
  return {
    id: `forum-reply-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    postId: input.postId,
    author: input.author || "You",
    content: input.content.trim(),
    createdAt: new Date().toISOString(),
  }
}

export function createBetShareCommunityPost(input: {
  author?: string
  legs: { eventName: string; selection: string; odds: string }[]
  stake?: number
}): CommunityForumPost {
  const isParlay = input.legs.length > 1
  const legs = input.legs.map((leg) => ({
    event: leg.eventName,
    selection: leg.selection,
    odds: leg.odds,
  }))

  let combinedOdds: string | undefined
  let potentialWin: string | undefined

  if (isParlay) {
    const decimalOdds = input.legs.map((b) => {
      const american = parseFloat(b.odds)
      if (Number.isNaN(american)) return 2
      return american > 0 ? american / 100 + 1 : 100 / Math.abs(american) + 1
    })
    const multiplied = decimalOdds.reduce((a, b) => a * b, 1)
    combinedOdds = multiplied >= 2 ? `+${Math.round((multiplied - 1) * 100)}` : `-${Math.round(100 / (multiplied - 1))}`
    if (input.stake && input.stake > 0) {
      potentialWin = `$${(input.stake * multiplied).toFixed(2)}`
    }
  }

  return {
    id: `forum-bet-${Date.now()}`,
    author: input.author || "You",
    source: "chat",
    type: "bet-share",
    content: isParlay ? "Shared a parlay to the forum." : "Shared a bet to the forum.",
    createdAt: new Date().toISOString(),
    betSlip: {
      type: isParlay ? "parlay" : "single",
      legs,
      combinedOdds,
      potentialWin,
    },
  }
}
