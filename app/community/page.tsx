"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  IconArrowLeft,
  IconBallFootball,
  IconClock,
  IconDice,
  IconFlame,
  IconGift,
  IconHash,
  IconMessageCircle2,
  IconNews,
  IconPlus,
  IconSearch,
  IconTrendingUp,
  IconUserCircle,
  IconUsersGroup,
  IconArrowBigUp,
  IconArrowBigDown,
} from "@tabler/icons-react"
import {
  addCommunityForumPost,
  COMMUNITY_FORUM_EVENT,
  type CommunityForumPost,
  readCommunityForumPosts,
} from "@/lib/community/forum"
import { useChatStore } from "@/lib/store/chatStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const topNavItems = [
  { label: "Forum", href: "/community", icon: IconMessageCircle2 },
  { label: "Casino", href: "/casino", icon: IconDice },
  { label: "Sportsbook", href: "/sports/soccer/premier-league", icon: IconBallFootball },
  { label: "Blog", href: "/journey-map", icon: IconNews },
]

const feedTabs = ["Hot", "New", "Top", "Bookmarked"]

const channels = [
  { name: "announcements", count: 22 },
  { name: "rewards-drop", count: 14 },
  { name: "daily-races", count: 31 },
  { name: "casino-tournaments", count: 19 },
  { name: "bet-slips", count: 55 },
  { name: "big-wins", count: 48 },
  { name: "support", count: 8 },
]

const onlineNow = ["DaveMason", "HighRoller_Mike", "OddsQueen", "BigWinBenny", "ParlaySharks", "VladanV"]

const events = [
  "Mon - Challenge Kickoff",
  "Wed - Expert AMA",
  "Fri - Community Fun Thread",
  "Sun - Race Leaderboard Reset",
]
const currentUserName = "Christopher"
const COMMUNITY_BOOKMARKS_KEY = "community_forum_bookmarks_v1"

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function getPostTitle(post: CommunityForumPost) {
  if (post.type === "bet-share") return "Bet Slip Shared"
  const trimmed = post.content.trim()
  if (trimmed.length <= 72) return trimmed
  return `${trimmed.slice(0, 72)}...`
}

function getPostBody(post: CommunityForumPost) {
  if (post.type === "bet-share") return post.content
  if (post.content.length <= 180) return post.content
  return `${post.content.slice(0, 180)}...`
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityForumPost[]>([])
  const [draft, setDraft] = useState("")
  const [activeFeedTab, setActiveFeedTab] = useState("Hot")
  const [channel, setChannel] = useState("announcements")
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<string[]>([])
  const { setIsOpen, setActiveRoom } = useChatStore()

  useEffect(() => {
    setActiveRoom("sports")
    setIsOpen(true)
    setPosts(readCommunityForumPosts())
    const sync = () => setPosts(readCommunityForumPosts())
    window.addEventListener(COMMUNITY_FORUM_EVENT, sync as EventListener)
    window.addEventListener("storage", sync as EventListener)
    return () => {
      window.removeEventListener(COMMUNITY_FORUM_EVENT, sync as EventListener)
      window.removeEventListener("storage", sync as EventListener)
    }
  }, [setActiveRoom, setIsOpen])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(COMMUNITY_BOOKMARKS_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as string[]
      if (Array.isArray(parsed)) setBookmarkedPostIds(parsed)
    } catch {}
  }, [])

  const sortedPosts = useMemo(
    () =>
      [...posts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [posts]
  )

  const bookmarkedSet = useMemo(() => new Set(bookmarkedPostIds), [bookmarkedPostIds])

  const scorePost = (post: CommunityForumPost) => {
    const managerBonus = post.author.toLowerCase().includes("manager") ? 18 : 0
    const betShareBonus = post.type === "bet-share" ? 12 : 0
    const contentScore = Math.min(28, Math.floor(post.content.length / 14))
    return managerBonus + betShareBonus + contentScore
  }

  const hotScore = (post: CommunityForumPost) => {
    const ageHours = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60)
    return scorePost(post) + Math.max(0, 36 - ageHours * 2.2)
  }

  const channelFilteredPosts = useMemo(() => {
    const matchesChannel = (post: CommunityForumPost) => {
      const text = `${post.content} ${post.betSlip?.legs.map((leg) => `${leg.event} ${leg.selection}`).join(" ") || ""}`.toLowerCase()
      if (channel === "announcements") return post.author.toLowerCase().includes("manager")
      if (channel === "rewards-drop") return text.includes("reward") || text.includes("vip")
      if (channel === "daily-races") return text.includes("race") || text.includes("leaderboard")
      if (channel === "casino-tournaments") return text.includes("tournament") || text.includes("casino")
      if (channel === "bet-slips") return post.type === "bet-share"
      if (channel === "big-wins") return text.includes("win") || text.includes("cash")
      if (channel === "support") return text.includes("help") || text.includes("support")
      return true
    }
    return sortedPosts.filter(matchesChannel)
  }, [sortedPosts, channel])

  const visiblePosts = useMemo(() => {
    if (activeFeedTab === "New") {
      return [...channelFilteredPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    if (activeFeedTab === "Top") {
      return [...channelFilteredPosts].sort((a, b) => scorePost(b) - scorePost(a))
    }
    if (activeFeedTab === "Bookmarked") {
      return channelFilteredPosts.filter((post) => bookmarkedSet.has(post.id))
    }
    // Hot (default)
    return [...channelFilteredPosts].sort((a, b) => hotScore(b) - hotScore(a))
  }, [activeFeedTab, channelFilteredPosts, bookmarkedSet])

  const trending = useMemo(() => sortedPosts.slice(0, 4), [sortedPosts])

  const submitPost = () => {
    const text = draft.trim()
    if (!text) return
    addCommunityForumPost({
      id: `community-${Date.now()}`,
      author: currentUserName,
      source: "community",
      type: "discussion",
      content: text,
      createdAt: new Date().toISOString(),
    })
    setDraft("")
  }

  const toggleBookmark = (postId: string) => {
    setBookmarkedPostIds((prev) => {
      const next = prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
      try {
        localStorage.setItem(COMMUNITY_BOOKMARKS_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }

  return (
    <main className="min-h-screen w-full bg-[#1a1a1a] text-white font-figtree">
      <div className="border-b border-white/10 bg-[#2d2d2d]">
        <div className="w-full px-4 md:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Link
                href="/sports/soccer/premier-league"
                className="h-8 w-8 rounded-small border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center shrink-0"
              >
                <IconArrowLeft className="w-4 h-4 text-white/80" />
              </Link>
              <div className="flex items-center gap-2 min-w-0 shrink-0">
                <div className="h-5 w-[110px] flex-shrink-0">
                  <svg viewBox="0 0 640 86" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <g id="BETONLINE">
                      <path fillRule="evenodd" clipRule="evenodd" d="M113.405 60.8753V61.3718C113.405 61.5704 113.405 61.769 113.505 61.8684V62.2656C113.405 66.6351 112.307 70.3095 110.211 73.2887C108.014 76.2679 105.219 78.7506 101.825 80.5381C98.4308 82.4249 94.5375 83.7159 90.2449 84.5104C85.9523 85.3048 81.6597 85.7021 77.367 85.7021H37.4357V36.4457H37.236C37.236 36.4457 7.08782 34.4596 0 34.4596C0 34.4596 20.1653 32.7714 37.236 32.4734H37.4357L37.3358 0H73.3739C77.5667 0 81.7595 0.297921 85.9523 0.794457C90.1451 1.3903 94.0384 2.38337 97.4325 3.97229C100.827 5.5612 103.722 7.84526 105.818 10.7252C108.014 13.6051 109.112 17.3788 109.112 22.1455C109.112 27.0115 107.615 31.0831 104.52 34.261L103.722 35.0554C103.722 35.0554 103.422 35.4527 102.723 36.0485C101.925 36.6443 101.126 37.2402 99.9282 37.9353C99.8284 37.985 99.7536 38.0346 99.6787 38.0843C99.6038 38.1339 99.5289 38.1836 99.4291 38.2333C93.1399 35.4527 86.0521 33.8637 80.861 32.97C83.9557 31.679 85.2535 30.388 85.6528 29.8915C85.799 29.7461 85.8916 29.6007 86.0091 29.4163C86.0521 29.3488 86.0984 29.2761 86.1519 29.1963C86.8507 28.0046 87.25 26.6143 87.25 25.0254C87.25 23.3372 86.8507 22.0462 86.0521 20.9538C85.1536 19.8614 84.1554 19.067 82.8576 18.4711C81.46 17.776 79.9626 17.3788 78.2655 17.0808C76.5684 16.7829 74.8713 16.6836 73.2741 16.6836H58.9986L59.0984 33.0693H59.7972C82.9574 34.4596 98.7303 38.6305 106.617 45.6813C107.415 46.2771 111.608 49.8522 113.006 56.6051L113.205 57.3002V57.5981C113.205 57.7471 113.23 57.8961 113.255 58.045C113.28 58.194 113.305 58.343 113.305 58.4919V58.8891C113.305 59.2367 113.33 59.5595 113.355 59.8822C113.38 60.205 113.405 60.5277 113.405 60.8753ZM90.5444 63.7552L90.6442 63.5566C91.343 62.2656 93.0401 57.9954 88.8473 52.7321C86.1519 49.6536 79.7629 45.2841 65.4874 41.5104L56.6027 39.4249L57.8007 40.8152L58.0003 41.0139C58.0262 41.0654 58.0723 41.1303 58.1316 41.2138C58.3007 41.4521 58.5772 41.8417 58.7989 42.5035L59.0984 43.3972C59.1068 43.4722 59.1152 43.5465 59.1235 43.6203C59.2143 44.4257 59.2981 45.1688 59.2981 46.0785C59.1983 48.7598 59.0984 61.6697 59.0984 67.3303V69.1178L59.8971 69.2171H77.6665C79.2638 69.2171 80.9609 69.0185 82.6579 68.7205C84.355 68.4226 85.8524 67.8268 87.1502 67.0323C88.448 66.2379 89.5461 65.2448 90.4445 63.9538C90.4445 63.9538 90.5444 63.8545 90.5444 63.7552Z" fill="#ee3536"/>
                      <path d="M120.693 85.7021V0.0993091H178.194V17.4781H140.558V33.6651H176.197V50.2494H140.658V68.0254H180.39V85.7021H120.693Z" fill="#ee3536"/>
                      <path d="M257.757 8.54042C261.251 5.16397 265.244 2.38337 269.736 0.0993091H185.781V17.776H209.939V85.7021H230.604V17.776H250.37C252.466 14.3995 254.962 11.321 257.757 8.54042Z" fill="#ee3536"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M313.761 3.47575C319.151 5.66051 323.843 8.63973 327.737 12.5127C331.63 16.3857 334.625 20.9538 336.821 26.1178C339.017 31.3811 340.115 37.0416 340.115 43.0993C340.115 49.1571 339.017 54.9169 336.821 60.0808C334.625 65.2448 331.63 69.8129 327.737 73.6859C323.843 77.4596 319.151 80.5381 313.761 82.7229C308.27 84.9076 302.28 86 295.891 86C289.403 86 283.413 84.9076 278.022 82.7229C272.631 80.5381 267.939 77.5589 264.046 73.6859C260.253 69.9122 257.158 65.2448 254.962 60.0808C252.766 54.8176 251.667 49.1571 251.667 43.0993C251.667 37.0416 252.766 31.2818 254.962 26.1178C257.158 20.9538 260.153 16.3857 264.046 12.5127C267.939 8.73903 272.631 5.66051 278.022 3.47575C283.513 1.291 289.502 0.198618 295.891 0.198618C302.38 0.198618 308.37 1.291 313.761 3.47575ZM324.642 55.3141C326.139 51.5404 326.838 47.3695 326.838 43.0993C326.838 38.8291 326.04 34.6582 324.642 30.8845C323.244 27.1109 321.148 23.7344 318.453 20.9538C315.757 18.1732 312.563 15.8891 308.769 14.2009C305.076 12.5127 300.783 11.7182 296.091 11.7182C291.399 11.7182 287.206 12.5127 283.413 14.2009C279.719 15.8891 276.425 18.1732 273.73 20.9538C271.134 23.7344 269.038 27.1109 267.54 30.8845C266.043 34.6582 265.344 38.8291 265.344 43.0993C265.344 47.3695 266.043 51.5404 267.54 55.3141C268.938 59.0878 271.034 62.4642 273.73 65.2448C276.425 68.0254 279.619 70.3095 283.413 71.9977C287.107 73.6859 291.399 74.4804 296.091 74.4804C300.783 74.4804 304.976 73.6859 308.769 71.9977C312.463 70.3095 315.757 68.0254 318.453 65.2448C321.048 62.4642 323.145 59.0878 324.642 55.3141Z" fill="white"/>
                      <path d="M437.847 0.0993091H425.069V85.6028H476.681V74.1824H437.847V0.0993091Z" fill="white"/>
                      <path d="M484.268 0.0993091H497.046V85.7021H484.268V0.0993091Z" fill="white"/>
                      <path d="M594.778 74.1824V48.2633H634.909V36.7436H594.778V11.6189H637.804V0.0993091H582V85.6028H640V74.1824H594.778Z" fill="white"/>
                      <path d="M347.802 0.0993091L405.403 56.903V0.0993091H417.482V85.6028L359.782 29.4942V85.6028H347.802V0.0993091Z" fill="white"/>
                      <path d="M562.333 57.3002L504.633 0.0993091V85.6028H516.712V29.8915L574.313 85.2055V0.0993091H562.333V57.3002Z" fill="white"/>
                    </g>
                  </svg>
                </div>
                <span className="text-sm font-semibold text-white/80 whitespace-nowrap">
                  Community
                </span>
              </div>
              <div className="bg-white/5 p-0.5 rounded-3xl hidden md:inline-flex items-center gap-1 ml-2">
                {topNavItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "px-4 py-1.5 h-8 text-xs font-medium rounded-2xl whitespace-nowrap inline-flex items-center gap-1.5",
                      item.label === "Forum"
                        ? "bg-[#ee3536] text-white"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(true)}
                className="h-8 w-8 rounded-small border border-white/20 bg-transparent text-white/70 hover:bg-white/10 hover:text-white flex items-center justify-center"
                title="Open Chat"
              >
                <IconMessageCircle2 className="w-4 h-4" />
              </button>
              <div className="h-8 px-3 rounded-small border border-white/20 bg-transparent text-white/85 text-xs font-semibold inline-flex items-center">
                {currentUserName}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 py-4 h-[calc(100vh-76px)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_320px] gap-4 h-full min-h-0">
          <Card className="border-white/10 bg-[#242424] h-fit lg:h-full lg:overflow-y-auto">
            <CardContent className="p-3.5">
              <div className="mb-3">
                <div className="text-[11px] uppercase tracking-wide text-white/50 mb-1">Channels</div>
                <div className="space-y-1">
                  {channels.map((ch) => (
                    <button
                      key={ch.name}
                      onClick={() => setChannel(ch.name)}
                      className={cn(
                        "w-full rounded-small px-2.5 py-2 text-left text-sm flex items-center justify-between transition-colors",
                        channel === ch.name
                          ? "bg-[#ee3536]/20 text-white border border-[#ee3536]/30"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <IconHash className="w-3.5 h-3.5" />
                        {ch.name}
                      </span>
                      <span className="text-xs text-white/50">{ch.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="text-[11px] uppercase tracking-wide text-white/50 mb-1">
                  Quick Access
                </div>
                <div className="space-y-1 text-sm text-white/70">
                  <p className="inline-flex items-center gap-1.5">
                    <IconGift className="w-3.5 h-3.5 text-amber-300" />
                    Rewards Drops
                  </p>
                  <p className="inline-flex items-center gap-1.5">
                    <IconTrendingUp className="w-3.5 h-3.5 text-emerald-300" />
                    Trending Threads
                  </p>
                  <p className="inline-flex items-center gap-1.5">
                    <IconClock className="w-3.5 h-3.5 text-sky-300" />
                    Daily Race Updates
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="min-h-0 h-full overflow-y-auto pr-1">
            <Card className="border-white/10 bg-[#232323] mb-3">
              <CardContent className="p-3.5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-amber-300">
                    <IconFlame className="w-3.5 h-3.5" />
                    Discover Feed
                  </div>
                  <div className="inline-flex items-center gap-1 bg-white/5 p-0.5 rounded-3xl">
                    {feedTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveFeedTab(tab)}
                        className={cn(
                          "h-7 px-3 rounded-2xl text-xs font-semibold inline-flex items-center justify-center leading-none",
                          activeFeedTab === tab
                            ? "bg-[#ee3536] text-white"
                            : "text-white/75 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-small border border-white/10 bg-[#262626] p-3">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={`Post in #${channel}... share slips, wins, race progress, or questions.`}
                    className="w-full h-20 resize-none bg-transparent outline-none text-sm text-white/90 placeholder:text-white/35"
                    maxLength={600}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-white/50">{visiblePosts.length} live discussions</span>
                    <Button
                      onClick={submitPost}
                      className="h-8 text-xs font-semibold bg-[#ee3536] hover:bg-[#d62e30] text-white"
                    >
                      <IconPlus className="w-3.5 h-3.5 mr-1" />
                      Create Post
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {visiblePosts.length === 0 && (
                <Card className="border-white/10 bg-[#242424]">
                  <CardContent className="p-5 text-center text-sm text-white/60">
                    No posts in this filter yet.
                  </CardContent>
                </Card>
              )}
              {visiblePosts.map((post) => (
                <Card key={post.id} className="border-white/10 bg-[#242424]">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-[56px_minmax(0,1fr)]">
                      <div className="border-r border-white/10 p-2.5 flex flex-col items-center gap-1 bg-[#202020]">
                        <button className="text-white/45 hover:text-white transition-colors">
                          <IconArrowBigUp className="w-5 h-5" />
                        </button>
                        <span className="text-xs font-semibold text-white/70">
                          {post.type === "bet-share" ? "42" : "18"}
                        </span>
                        <button className="text-white/45 hover:text-white transition-colors">
                          <IconArrowBigDown className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="p-3.5">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-[#313131] flex items-center justify-center">
                              <IconUserCircle className="w-4 h-4 text-white/70" />
                            </div>
                            <span className="text-sm font-semibold truncate">{post.author}</span>
                            <span className="text-[10px] uppercase tracking-wide text-white/45">
                              {post.author.toLowerCase().includes("manager") ? "manager" : "member"}
                            </span>
                          </div>
                          <span className="text-[11px] text-white/45 whitespace-nowrap">{formatTime(post.createdAt)}</span>
                        </div>

                        <h3 className="text-base font-semibold mb-1">
                          <Link href={`/community/post/${post.id}`} className="hover:text-[#ee3536] transition-colors">
                            {getPostTitle(post)}
                          </Link>
                        </h3>
                        <p className="text-sm text-white/80">{getPostBody(post)}</p>

                        {post.betSlip && (
                          <div className="mt-2.5 rounded-small border border-emerald-400/30 bg-emerald-500/10 p-2.5">
                            <div className="text-[11px] font-semibold text-emerald-300 mb-1">
                              {post.betSlip.type === "parlay" ? "Parlay Bet Share" : "Single Bet Share"}
                            </div>
                            {post.betSlip.legs.map((leg, i) => (
                              <div key={`${post.id}-${i}`} className="text-xs text-white/85">
                                <span className="text-white/60">{leg.event}:</span> {leg.selection} ({leg.odds})
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-3 flex items-center gap-3 text-xs text-white/55">
                          <Link href={`/community/post/${post.id}`} className="hover:text-white transition-colors">
                            Reply
                          </Link>
                          <button className="hover:text-white transition-colors">Share</button>
                          <button
                            onClick={() => toggleBookmark(post.id)}
                            className={cn(
                              "transition-colors",
                              bookmarkedSet.has(post.id) ? "text-amber-300 hover:text-amber-200" : "hover:text-white"
                            )}
                          >
                            {bookmarkedSet.has(post.id) ? "Bookmarked" : "Bookmark"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-3 h-fit lg:h-full lg:overflow-y-auto">
            <Card className="border-white/10 bg-[#242424]">
              <CardContent className="p-3.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <IconSearch className="w-4 h-4 text-white/65" />
                  <h3 className="text-sm font-semibold">Trending Discussions</h3>
                </div>
                <div className="space-y-2">
                  {trending.map((post) => (
                    <Link
                      key={`trend-${post.id}`}
                      href={`/community/post/${post.id}`}
                      className="w-full text-left rounded-small p-2 bg-white/[0.03] hover:bg-white/[0.07] transition-colors"
                    >
                      <p className="text-sm font-medium truncate">{getPostTitle(post)}</p>
                      <p className="text-xs text-white/55 mt-0.5">by {post.author}</p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#242424]">
              <CardContent className="p-3.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <IconUsersGroup className="w-4 h-4 text-emerald-300" />
                  <h3 className="text-sm font-semibold">Online Now</h3>
                </div>
                <div className="space-y-1.5">
                  {onlineNow.map((name) => (
                    <div key={name} className="text-sm text-white/80 inline-flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#242424]">
              <CardContent className="p-3.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <IconClock className="w-4 h-4 text-amber-300" />
                  <h3 className="text-sm font-semibold">Events This Week</h3>
                </div>
                <ul className="space-y-1.5 text-sm text-white/80">
                  {events.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
