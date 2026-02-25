"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { IconArrowLeft, IconMessageCircle2, IconPlus, IconUserCircle } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  addCommunityForumReply,
  COMMUNITY_FORUM_EVENT,
  COMMUNITY_FORUM_REPLY_EVENT,
  createCommunityForumReply,
  type CommunityForumPost,
  type CommunityForumReply,
  readCommunityForumPosts,
  readCommunityForumReplies,
} from "@/lib/community/forum"

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

export default function CommunityPostThreadPage() {
  const params = useParams<{ postId: string }>()
  const postId = params?.postId || ""
  const [posts, setPosts] = useState<CommunityForumPost[]>([])
  const [replies, setReplies] = useState<CommunityForumReply[]>([])
  const [replyDraft, setReplyDraft] = useState("")

  useEffect(() => {
    const sync = () => {
      setPosts(readCommunityForumPosts())
      setReplies(readCommunityForumReplies(postId))
    }
    sync()
    window.addEventListener(COMMUNITY_FORUM_EVENT, sync as EventListener)
    window.addEventListener(COMMUNITY_FORUM_REPLY_EVENT, sync as EventListener)
    window.addEventListener("storage", sync as EventListener)
    return () => {
      window.removeEventListener(COMMUNITY_FORUM_EVENT, sync as EventListener)
      window.removeEventListener(COMMUNITY_FORUM_REPLY_EVENT, sync as EventListener)
      window.removeEventListener("storage", sync as EventListener)
    }
  }, [postId])

  const post = useMemo(() => posts.find((entry) => entry.id === postId), [postId, posts])

  const submitReply = () => {
    const trimmed = replyDraft.trim()
    if (!trimmed || !postId) return
    addCommunityForumReply(createCommunityForumReply({ postId, content: trimmed, author: "Christopher" }))
    setReplyDraft("")
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-[#1f1f1f] text-white">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <Link href="/community" className="inline-flex items-center gap-2 text-sm text-white/75 hover:text-white">
            <IconArrowLeft className="w-4 h-4" />
            Back to community
          </Link>
          <Card className="mt-4 border-white/10 bg-[#242424]">
            <CardContent className="p-6 text-white/70">This post was not found.</CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#1f1f1f] text-white">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <Link href="/community" className="inline-flex items-center gap-2 text-sm text-white/75 hover:text-white">
            <IconArrowLeft className="w-4 h-4" />
            Back to community
          </Link>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/60">
            <IconMessageCircle2 className="w-4 h-4" />
            Topic Thread
          </div>
        </div>

        <Card className="border-white/10 bg-[#242424] mb-3">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="inline-flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#313131] flex items-center justify-center">
                  <IconUserCircle className="w-5 h-5 text-white/70" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{post.author}</div>
                  <div className="text-xs text-white/45">{formatTime(post.createdAt)}</div>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-wide text-white/45">
                {post.author.toLowerCase().includes("manager") ? "manager" : "member"}
              </span>
            </div>
            <h1 className="text-lg font-semibold mb-1">{getPostTitle(post)}</h1>
            <p className="text-sm text-white/85">{post.content}</p>
            {post.betSlip && (
              <div className="mt-3 rounded-small border border-emerald-400/30 bg-emerald-500/10 p-3">
                <div className="text-[11px] font-semibold text-emerald-300 mb-1">
                  {post.betSlip.type === "parlay" ? "Parlay Bet Share" : "Single Bet Share"}
                </div>
                {post.betSlip.legs.map((leg, idx) => (
                  <div key={`thread-leg-${idx}`} className="text-xs text-white/85">
                    <span className="text-white/60">{leg.event}:</span> {leg.selection} ({leg.odds})
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#242424] mb-3">
          <CardContent className="p-3">
            <textarea
              value={replyDraft}
              onChange={(e) => setReplyDraft(e.target.value)}
              placeholder="Add to this topic..."
              className="w-full h-20 resize-none bg-transparent outline-none text-sm text-white/90 placeholder:text-white/35"
              maxLength={500}
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-white/55">{replies.length} replies</span>
              <Button onClick={submitReply} className="h-8 text-xs font-semibold bg-[#ee3536] hover:bg-[#d62e30] text-white">
                <IconPlus className="w-3.5 h-3.5 mr-1" />
                Reply
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2.5">
          {replies.length === 0 && (
            <Card className="border-white/10 bg-[#242424]">
              <CardContent className="p-4 text-sm text-white/65">No replies yet. Start the thread.</CardContent>
            </Card>
          )}
          {replies.map((reply) => (
            <Card key={reply.id} className="border-white/10 bg-[#242424]">
              <CardContent className="p-3.5">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#313131] flex items-center justify-center">
                      <IconUserCircle className="w-4 h-4 text-white/70" />
                    </div>
                    <span className="text-sm font-semibold">{reply.author}</span>
                  </div>
                  <span className="text-[11px] text-white/45">{formatTime(reply.createdAt)}</span>
                </div>
                <p className="text-sm text-white/85">{reply.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
