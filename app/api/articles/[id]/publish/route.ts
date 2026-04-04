import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import FormData from "form-data"

import { marked } from "marked"

import { requireApiUser } from "@/lib/auth/api"
import { prisma } from "@/lib/db/prisma"
import { decryptString } from "@/lib/crypto/encryption"
import { getEffectivePlan, isWpAllowed } from "@/lib/plans/plans"

export const runtime = "nodejs"

async function readBody(req: Request) {
  if (!req.body) return {}
  return await req.json().catch(() => ({}))
}

function basicAuth(username: string, password: string) {
  const token = Buffer.from(`${username}:${password}`, "utf8").toString("base64")
  return `Basic ${token}`
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiUser()
  if (auth.errorResponse) return auth.errorResponse

  const plan = getEffectivePlan({ planTier: auth.user.planTier, planActiveUntil: auth.user.planActiveUntil })
  if (!isWpAllowed(plan)) {
    return NextResponse.json({ error: "Publishing to WordPress is available on Pro and Premium plans." }, { status: 403 })
  }

  const { id } = await ctx.params
  const body = await readBody(req)
  const requestedConnectionId = typeof body?.connectionId === "string" ? body.connectionId : null

  const [article, wp] = await Promise.all([
    prisma.article.findFirst({
      where: { id, userId: auth.user.id },
      select: { id: true, videoTitle: true, finalMarkdown: true, imagePath: true },
    }),
    requestedConnectionId
      ? prisma.wordPressConnection.findFirst({ where: { id: requestedConnectionId, userId: auth.user.id } })
      : prisma.wordPressConnection.findFirst({
          where: { userId: auth.user.id, isDefault: true },
        }),
  ])

  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (!article.finalMarkdown) {
    return NextResponse.json({ error: "Article is not ready yet" }, { status: 400 })
  }
  if (!wp) {
    const any = await prisma.wordPressConnection.findFirst({ where: { userId: auth.user.id }, select: { id: true } })
    return NextResponse.json(
      { error: any ? "Select a WordPress site to publish to" : "Connect WordPress first" },
      { status: 400 }
    )
  }

  const appPassword = decryptString(wp.encryptedAppPassword)
  const siteUrl = wp.siteUrl.replace(/\/$/, "")

  const html = await marked.parse(article.finalMarkdown)
  const title = article.videoTitle || "Article"

  // Upload image to WordPress if available
  let featuredMediaId: number | null = null
  if (article.imagePath) {
    try {
      const imageFullPath = path.join(process.cwd(), article.imagePath)
      
      // Check if image file exists
      try {
        await fs.access(imageFullPath)
      } catch {
        console.error(`Image file not found: ${imageFullPath}`)
      }

      // Read image file
      const imageBuffer = await fs.readFile(imageFullPath)
      const imageFilename = path.basename(article.imagePath)
      const imageExtension = path.extname(imageFilename).slice(1) || "png"
      const mimeType = imageExtension === "jpg" || imageExtension === "jpeg" 
        ? "image/jpeg" 
        : imageExtension === "png" 
        ? "image/png" 
        : imageExtension === "webp"
        ? "image/webp"
        : "image/png"

      // Create FormData for WordPress media upload
      const formData = new FormData()
      
      // Append file buffer
      formData.append("file", imageBuffer, {
        filename: imageFilename,
        contentType: mimeType,
      })
      formData.append("title", title)
      formData.append("caption", "")
      formData.append("description", "")

      // Upload to WordPress media library
      const mediaRes = await fetch(`${siteUrl}/wp-json/wp/v2/media`, {
        method: "POST",
        headers: {
          authorization: basicAuth(wp.username, appPassword),
          ...formData.getHeaders(),
        },
        body: formData as any,
      })

      if (mediaRes.ok) {
        const mediaData = await mediaRes.json()
        featuredMediaId = mediaData.id
      } else {
        const mediaError = await mediaRes.json().catch(() => ({}))
        console.error("Failed to upload image to WordPress:", mediaError)
        // Continue publishing without image if upload fails
      }
    } catch (imageError) {
      console.error("Error uploading image to WordPress:", imageError)
      // Continue publishing without image if upload fails
    }
  }

  const postData: {
    title: string
    content: string
    status: string
    featured_media?: number
  } = {
    title,
    content: html,
    status: "publish",
  }

  if (featuredMediaId !== null) {
    postData.featured_media = featuredMediaId
  }

  const res = await fetch(`${siteUrl}/wp-json/wp/v2/posts`, {
    method: "POST",
    headers: {
      authorization: basicAuth(wp.username, appPassword),
      "content-type": "application/json",
    },
    body: JSON.stringify(postData),
  })

  const wpBody = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = wpBody?.message || `WordPress error (${res.status})`
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  return NextResponse.json({ ok: true, url: wpBody?.link })
}

