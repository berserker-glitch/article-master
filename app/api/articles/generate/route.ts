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
  generationPrefs: z
    .object({
      language: z.string().max(10).optional(),
      tone: z.string().max(500).optional(),
      include: z.string().max(2000).optional(),
      exclude: z.string().max(2000).optional(),
      additionalNotes: z.string().max(4000).optional(),
      seoKeywords: z.string().max(1000).optional(),
    })
    .optional(),
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

  // Get the correct base URL from headers (for proxy/production) or environment variable
  function getBaseUrl(): string {
    // Check for forwarded protocol and host (common in production/proxy setups)
    const forwardedProto = req.headers.get("x-forwarded-proto")
    const forwardedHost = req.headers.get("x-forwarded-host")
    const host = req.headers.get("host")

    if (forwardedProto && forwardedHost) {
      return `${forwardedProto}://${forwardedHost}`
    }
    if (forwardedProto && host) {
      return `${forwardedProto}://${host}`
    }
    if (host) {
      // Use https if we're likely in production, http for localhost
      const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https"
      return `${protocol}://${host}`
    }

    // Fallback to environment variable or localhost
    return (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "")
  }

  const baseUrl = getBaseUrl()

  const [subsRes, detailsRes] = await Promise.all([
    fetch(`${baseUrl}/api/subtitles?videoID=${encodeURIComponent(videoId)}`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/videoDetails?videoID=${encodeURIComponent(videoId)}`, { cache: "no-store" }),
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
      ...(parsed.data.generationPrefs ? { generationPrefs: parsed.data.generationPrefs } : {}),
    },
    select: { id: true },
  })

  // Fire-and-forget pipeline execution (sufficient for a single-node deployment/dev).
  // In production at scale, this would be moved to a job queue/worker.
  void runArticlePipeline(article.id)

  return NextResponse.json({ ok: true, articleId: article.id })
}
