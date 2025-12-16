"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Subtitle = {
  start: string
  dur: string
  text: string
}

type VideoDetails = {
  title?: string
  description?: string
}

function extractYoutubeVideoId(input: string): string | null {
  const value = input.trim()
  if (!value) return null

  // If they paste a raw ID.
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value

  // Handle URLs.
  try {
    const url = new URL(value)
    const hostname = url.hostname.replace(/^www\./, "")

    // https://youtu.be/VIDEOID
    if (hostname === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0]
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null
    }

    // https://youtube.com/watch?v=VIDEOID
    if (hostname.endsWith("youtube.com")) {
      const v = url.searchParams.get("v")
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v

      // /shorts/VIDEOID, /embed/VIDEOID, /v/VIDEOID
      const parts = url.pathname.split("/").filter(Boolean)
      const idx = parts.findIndex((p) => ["shorts", "embed", "v"].includes(p))
      const id = idx >= 0 ? parts[idx + 1] : null
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null
    }
  } catch {
    // Not a valid URL; fall through.
  }

  return null
}

export function CaptionExtractorExample() {
  const [youtubeUrlOrId, setYoutubeUrlOrId] = React.useState("")
  const [subtitles, setSubtitles] = React.useState<Subtitle[]>([])
  const [videoDetails, setVideoDetails] = React.useState<VideoDetails>({})
  const [error, setError] = React.useState<string | null>(null)
  const [isFetching, setIsFetching] = React.useState(false)

  const transcript = React.useMemo(
    () => subtitles.map((s) => s.text).join(" "),
    [subtitles]
  )

  const fetchCaptions = async () => {
    const videoID = extractYoutubeVideoId(youtubeUrlOrId)
    if (!videoID) {
      setError("Please paste a valid YouTube URL (or a raw 11-char video ID).")
      setSubtitles([])
      setVideoDetails({})
      return
    }

    setIsFetching(true)
    try {
      const [subtitlesResponse, videoDetailsResponse] = await Promise.all([
        fetch(`/api/subtitles?videoID=${videoID}`),
        fetch(`/api/videoDetails?videoID=${videoID}`),
      ])

      if (!subtitlesResponse.ok) {
        const body = await subtitlesResponse.json().catch(() => ({}))
        throw new Error(body?.error || `Subtitles API Error: ${subtitlesResponse.status}`)
      }
      if (!videoDetailsResponse.ok) {
        const body = await videoDetailsResponse.json().catch(() => ({}))
        throw new Error(body?.error || `Video Details API Error: ${videoDetailsResponse.status}`)
      }

      const subtitlesResult = await subtitlesResponse.json()
      const videoDetailsResult = await videoDetailsResponse.json()

      setSubtitles(subtitlesResult.subtitles || [])
      setVideoDetails(videoDetailsResult.videoDetails || {})
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <Card className="mx-auto my-10 w-full max-w-md">
      <CardHeader>
        <CardTitle>YouTube caption extractor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="yt-url">YouTube URL (or ID)</FieldLabel>
            <Input
              id="yt-url"
              value={youtubeUrlOrId}
              onChange={(e) => setYoutubeUrlOrId(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=5I1jTJ9sYeA"
            />
          </Field>
          <Button type="button" onClick={fetchCaptions} disabled={isFetching}>
            {isFetching ? "Fetching..." : "Fetch captions"}
          </Button>
        </FieldGroup>

        {error && <p className="text-destructive text-sm">Error: {error}</p>}

        {!!videoDetails.title && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Title</div>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {videoDetails.title}
            </div>
          </div>
        )}

        {!!videoDetails.description && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Description</div>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {videoDetails.description}
            </div>
          </div>
        )}

        {subtitles.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Transcript</div>
            <Textarea value={transcript} readOnly className="min-h-32" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}


