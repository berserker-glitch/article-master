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
    return NextResponse.json(
      { 
        error: "Invalid request",
        details: parsed.error.flatten().fieldErrors,
        received: body
      },
      { status: 400 }
    )
  }

  const youtubeUrl = parsed.data.youtubeUrl
  const videoId = extractYoutubeVideoId(youtubeUrl)
  if (!videoId) {
    return NextResponse.json({ error: "Please paste a valid YouTube URL" }, { status: 400 })
  }

  // Get the correct base URL from headers (for proxy/production) or environment variable
  // For internal API calls, we prefer using the same origin to avoid SSL/network issues
  function getBaseUrl(): string {
    // Check for forwarded protocol and host (common in production/proxy setups)
    const forwardedProto = req.headers.get("x-forwarded-proto")
    const forwardedHost = req.headers.get("x-forwarded-host")
    const host = req.headers.get("host")

    // Try to use the request's origin first
    try {
      const requestUrl = new URL(req.url)
      if (requestUrl.origin) {
        return requestUrl.origin
      }
    } catch {
      // If URL parsing fails, continue with header-based detection
    }

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

  // Fetch subtitles and video details using the caption-extractor library
  // These routes use youtube-caption-extractor to get transcripts and metadata
  const subtitlesUrl = `${baseUrl}/api/subtitles?videoID=${encodeURIComponent(videoId)}`
  const detailsUrl = `${baseUrl}/api/videoDetails?videoID=${encodeURIComponent(videoId)}`

  let subsRes: Response
  let detailsRes: Response

  try {
    [subsRes, detailsRes] = await Promise.all([
      fetch(subtitlesUrl, { cache: "no-store" }),
      fetch(detailsUrl, { cache: "no-store" }),
    ])
  } catch (fetchError) {
    return NextResponse.json(
      {
        error: "Failed to connect to internal API",
        details: fetchError instanceof Error ? fetchError.message : String(fetchError),
        baseUrl,
        videoId,
        suggestion: "This might be a network configuration issue. Please try again or contact support."
      },
      { status: 500 }
    )
  }

  if (!subsRes.ok) {
    const payload = await subsRes.json().catch(() => ({}))
    return NextResponse.json(
      { 
        error: payload?.error || "Failed to fetch subtitles",
        status: subsRes.status,
        statusText: subsRes.statusText,
        videoId,
        url: subtitlesUrl,
        attemptedLanguages: payload?.attemptedLanguages
      },
      { status: 400 }
    )
  }

  if (!detailsRes.ok) {
    const payload = await detailsRes.json().catch(() => ({}))
    return NextResponse.json(
      { 
        error: payload?.error || "Failed to fetch video details",
        status: detailsRes.status,
        statusText: detailsRes.statusText,
        videoId,
        url: detailsUrl
      },
      { status: 400 }
    )
  }

  const subsJson = await subsRes.json().catch(() => ({}))
  const detailsJson = await detailsRes.json().catch(() => ({}))

  // Extract subtitles - youtube-caption-extractor returns Subtitle[] directly
  // but our API wraps it in { subtitles: Subtitle[] }
  let subtitles: Subtitle[] = []
  
  if (Array.isArray(subsJson.subtitles)) {
    subtitles = subsJson.subtitles
  } else if (Array.isArray(subsJson)) {
    // In case the API returns the array directly
    subtitles = subsJson
  }

  // Validate subtitle structure
  if (subtitles.length > 0) {
    // Ensure all subtitles have the required fields
    subtitles = subtitles
      .map((sub: any) => {
        if (typeof sub === "object" && sub !== null) {
          // Handle different possible property names
          const text = sub.text || sub.textContent || ""
          const start = sub.start || sub.startTime || "0"
          const dur = sub.dur || sub.duration || sub.dur || "0"
          
          if (text && typeof text === "string") {
            return { start: String(start), dur: String(dur), text: String(text) }
          }
        }
        return null
      })
      .filter((s: Subtitle | null): s is Subtitle => s !== null)
  }

  // Build transcript from subtitles
  const transcript = subtitles.length > 0 
    ? subtitles.map((s) => s.text).join(" ").trim()
    : ""

  // Validate that we have a transcript
  if (!transcript) {
    // Check if we got an error from the subtitles API
    if (subsJson.error) {
      return NextResponse.json(
        { 
          error: `Failed to get subtitles: ${subsJson.error}`,
          videoId,
          suggestion: "Make sure the video has captions enabled. You can check this on YouTube by clicking the CC button."
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: "No transcript available for this video. The video may not have captions enabled, or the captions may not be accessible.",
        videoId,
        details: {
          subtitlesReceived: subtitles.length,
          subsJsonKeys: Object.keys(subsJson),
          hasSubtitlesKey: "subtitles" in subsJson,
        },
        suggestion: "Please ensure the YouTube video has captions enabled. You can check this by viewing the video on YouTube and looking for the CC (closed captions) button."
      },
      { status: 400 }
    )
  }

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
