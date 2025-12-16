export function extractYoutubeVideoId(input: string): string | null {
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
    // Not a valid URL.
  }

  return null
}
