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
      // If it's the last language, return the error
      return NextResponse.json(
        { 
          error: (error as Error).message || "Failed to fetch subtitles",
          videoID,
          attemptedLanguages: languagesToTry
        },
        { status: 500 }
      )
    }
  }

  // If we get here, no subtitles were found in any language
  return NextResponse.json(
    { 
      error: "No subtitles available for this video in the requested language or fallback languages",
      videoID,
      attemptedLanguages: languagesToTry
    },
    { status: 404 }
  )
}


