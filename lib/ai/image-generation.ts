import { promises as fs } from "fs"
import path from "path"

const IMAGE_MODEL = "google/gemini-3-pro-image-preview"

export async function generateArticleImage(args: {
  articleTitle: string
  articleContent: string
  articleId: string
}): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    console.error("Missing OPENROUTER_API_KEY for image generation")
    return null
  }

  try {
    // Generate image prompt based on article title and content
    // Extract a brief summary from the article content (first 500 chars)
    const contentPreview = args.articleContent.substring(0, 500).replace(/#{1,6}\s+/g, "").trim()
    
    const imagePrompt = `Create a high-quality, professional article header image for an article titled: "${args.articleTitle}".

Article preview: ${contentPreview}

The image should be:
- Visually appealing and professional
- Relevant to the article topic and content
- Suitable for use as a blog post featured image
- Modern and clean design style
- Appropriate for the article's subject matter`

    // Call OpenRouter API for image generation
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
        "X-Title": "ArticleMaster",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: IMAGE_MODEL,
        messages: [
          {
            role: "user",
            content: imagePrompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      console.error(`Image generation failed: ${response.status} ${errorText}`)
      return null
    }

    const data = await response.json().catch(() => null)
    if (!data) {
      console.error("Failed to parse image generation response")
      return null
    }

    // Extract image data from response
    // OpenRouter/Gemini image generation may return base64-encoded image data
    let imageData: Buffer | null = null
    let imageExtension = "png"

    // Try to find base64 image data in the response
    if (data.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
      const inlineData = data.candidates[0].content.parts[0].inlineData
      if (inlineData.data) {
        imageData = Buffer.from(inlineData.data, "base64")
        const mimeType = inlineData.mimeType || "image/png"
        if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
          imageExtension = "jpg"
        } else if (mimeType.includes("png")) {
          imageExtension = "png"
        } else if (mimeType.includes("webp")) {
          imageExtension = "webp"
        }
      }
    }

    // Alternative: Check if response contains image URL
    if (!imageData && data.choices?.[0]?.message?.content) {
      const content = data.choices[0].message.content
      const urlMatch = content.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|webp)/i)
      if (urlMatch) {
        const imageUrl = urlMatch[0]
        imageExtension = urlMatch[1].toLowerCase()
        const imageResponse = await fetch(imageUrl)
        if (imageResponse.ok) {
          const imageBuffer = await imageResponse.arrayBuffer()
          imageData = Buffer.from(imageBuffer)
        }
      }
    }

    if (!imageData) {
      console.error("No image data found in response", JSON.stringify(data, null, 2))
      return null
    }

    // Ensure images directory exists
    const imagesDir = path.join(process.cwd(), "..", "images")
    await fs.mkdir(imagesDir, { recursive: true })

    // Save image with article ID as filename
    const imageFilename = `${args.articleId}.${imageExtension}`
    const imagePath = path.join(imagesDir, imageFilename)

    await fs.writeFile(imagePath, imageData)

    // Return relative path from project root
    return path.join("..", "images", imageFilename)
  } catch (error) {
    console.error("Error generating article image:", error)
    return null
  }
}
