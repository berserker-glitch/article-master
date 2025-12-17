import { NextResponse } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { requireApiUser } from "@/lib/auth/api"
import { extractYoutubeVideoId } from "@/lib/youtube/video-id"
import { runArticlePipeline } from "@/lib/ai/pipeline"
import { enforceCanGenerateArticle } from "@/lib/plans/plans"
import { z } from "zod"

export const runtime = "nodejs"

const bodySchema = z.object({
  youtubeUrl: z.string().min(1),
})

type Subtitle = { start: string; dur: string; text: string }

export async function POST(req: Request) {
  const auth = await requireApiUser()
  if (auth.errorResponse) return auth.errorResponse

  const allowed = await enforceCanGenerateArticle(auth.user.id)
  if (!allowed.ok) {
    return NextResponse.json(
      {
        error: allowed.error,
        ...(("plan" in allowed && allowed.plan) ? { plan: allowed.plan, used: allowed.used, max: allowed.max } : {}),
      },
      { status: 429 }
    )
  }

  const body = await req.json().catch(() => ({}))
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const youtubeUrl = parsed.data.youtubeUrl
  const videoId = extractYoutubeVideoId(youtubeUrl)
  if (!videoId) {
    return NextResponse.json({ error: "Please paste a valid YouTube URL" }, { status: 400 })
  }

  const origin = new URL(req.url).origin

  const [subsRes, detailsRes] = await Promise.all([
    fetch(`${origin}/api/subtitles?videoID=${encodeURIComponent(videoId)}`, { cache: "no-store" }),
    fetch(`${origin}/api/videoDetails?videoID=${encodeURIComponent(videoId)}`, { cache: "no-store" }),
  ])

  if (!subsRes.ok) {
    const payload = await subsRes.json().catch(() => ({}))
    return NextResponse.json({ error: payload?.error || "Failed to fetch subtitles" }, { status: 400 })
  }

  if (!detailsRes.ok) {
    const payload = await detailsRes.json().catch(() => ({}))
    return NextResponse.json({ error: payload?.error || "Failed to fetch video details" }, { status: 400 })
  }

  const subsJson = await subsRes.json()
  const detailsJson = await detailsRes.json()

  const subtitles: Subtitle[] = subsJson.subtitles || []
  const transcript = subtitles.map((s) => s.text).join(" ").trim()

  const videoTitle = detailsJson?.videoDetails?.title
  const videoDescription = detailsJson?.videoDetails?.description

  const article = await prisma.article.create({
    data: {
      userId: auth.user.id,
      status: "RUNNING",
      sourceUrl: youtubeUrl,
      videoId,
      videoTitle,
      videoDescription,
      transcript,
    },
    select: { id: true },
  })

  // Fire-and-forget pipeline execution (sufficient for a single-node deployment/dev).
  // In production at scale, this would be moved to a job queue/worker.
  void runArticlePipeline(article.id)

  return NextResponse.json({ ok: true, articleId: article.id })
}
