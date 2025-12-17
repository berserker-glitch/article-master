import { getSubtitles } from "youtube-caption-extractor"
import { NextResponse } from "next/server"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const videoID = searchParams.get("videoID")
  const lang = searchParams.get("lang") || "en"

  if (!videoID) {
    return NextResponse.json({ error: "Missing videoID" }, { status: 400 })
  }

  // Try to get subtitles, with fallback to auto-detect language if specified language fails
  const languagesToTry = lang === "en" ? ["en", "en-US", "en-GB"] : [lang, "en", "en-US"]
  
  for (const tryLang of languagesToTry) {
    try {
      const subtitles = await getSubtitles({ videoID, lang: tryLang })
      
      // Validate that we got actual subtitles
      if (Array.isArray(subtitles) && subtitles.length > 0) {
        // Ensure all subtitles have the required structure
        const validSubtitles = subtitles.filter(
          (sub: any) => 
            sub && 
            typeof sub === "object" && 
            typeof sub.text === "string" && 
            sub.text.trim().length > 0
        )
        
        if (validSubtitles.length > 0) {
          return NextResponse.json({ subtitles: validSubtitles }, { status: 200 })
        }
      }
    } catch (error) {
      // If this isn't the last language to try, continue to next
      if (tryLang !== languagesToTry[languagesToTry.length - 1]) {
        continue
      }
      
      // Primary extractor failed - try Python fallback
      try {
        const origin = new URL(request.url).origin
        const pythonFallbackRes = await fetch(
          `${origin}/api/subtitles-python?videoID=${encodeURIComponent(videoID)}&lang=${encodeURIComponent(lang)}`,
          { cache: "no-store" }
        )
        
        if (pythonFallbackRes.ok) {
          const pythonResult = await pythonFallbackRes.json()
          if (pythonResult.subtitles && Array.isArray(pythonResult.subtitles) && pythonResult.subtitles.length > 0) {
            return NextResponse.json(
              { 
                subtitles: pythonResult.subtitles,
                source: "python-fallback"
              },
              { status: 200 }
            )
          }
        } else {
          // Check if Python fallback returned an IP blocking error
          const pythonError = await pythonFallbackRes.json().catch(() => ({}))
          if (pythonError.isIPBlocked) {
            return NextResponse.json(
              {
                error: pythonError.error || "YouTube is blocking requests from this server's IP address",
                videoID,
                attemptedLanguages: languagesToTry,
                note: "Both JavaScript and Python extractors failed due to IP blocking",
                isIPBlocked: true,
                suggestion: pythonError.suggestion || "This is a temporary limitation. Please try again later."
              },
              { status: 503 }
            )
          }
        }
      } catch (fallbackError) {
        // Python fallback also failed, return original error
      }
      
      // Check if this is an IP blocking error
      const errorMessage = (error as Error).message || "Failed to fetch subtitles"
      const isIPBlocked = errorMessage.includes("IP") || 
                         errorMessage.includes("blocked") || 
                         errorMessage.includes("cloud provider") ||
                         errorMessage.includes("too many requests")
      
      // Both extractors failed, return the error
      return NextResponse.json(
        { 
          error: isIPBlocked 
            ? "YouTube is blocking requests from this server's IP address. This is a known limitation when using cloud hosting providers. Please try again later or contact support."
            : errorMessage,
          videoID,
          attemptedLanguages: languagesToTry,
          note: "Both JavaScript and Python extractors failed",
          isIPBlocked,
          ...(isIPBlocked ? {
            suggestion: "This is a temporary limitation. The service will retry automatically, or you can try again in a few minutes."
          } : {})
        },
        { status: isIPBlocked ? 503 : 500 }
      )
    }
  }

  // If we get here, no subtitles were found in any language - try Python fallback
  try {
    const origin = new URL(request.url).origin
    const pythonFallbackRes = await fetch(
      `${origin}/api/subtitles-python?videoID=${encodeURIComponent(videoID)}&lang=${encodeURIComponent(lang)}`,
      { cache: "no-store" }
    )
    
    if (pythonFallbackRes.ok) {
      const pythonResult = await pythonFallbackRes.json()
      if (pythonResult.subtitles && Array.isArray(pythonResult.subtitles) && pythonResult.subtitles.length > 0) {
        return NextResponse.json(
          { 
            subtitles: pythonResult.subtitles,
            source: "python-fallback"
          },
          { status: 200 }
        )
      }
    } else {
      // Check if Python fallback returned an IP blocking error
      const pythonError = await pythonFallbackRes.json().catch(() => ({}))
      if (pythonError.isIPBlocked) {
        return NextResponse.json(
          {
            error: pythonError.error || "YouTube is blocking requests from this server's IP address",
            videoID,
            attemptedLanguages: languagesToTry,
            note: "Both JavaScript and Python extractors failed due to IP blocking",
            isIPBlocked: true,
            suggestion: pythonError.suggestion || "This is a temporary limitation. Please try again later."
          },
          { status: 503 }
        )
      }
    }
  } catch (fallbackError) {
    // Python fallback failed, continue to return error
  }

  // If we get here, no subtitles were found in any language
  return NextResponse.json(
    { 
      error: "No subtitles available for this video in the requested language or fallback languages",
      videoID,
      attemptedLanguages: languagesToTry,
      note: "Both JavaScript and Python extractors were tried"
    },
    { status: 404 }
  )
}


