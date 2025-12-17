import { NextResponse } from "next/server"

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
      select: { id: true, videoTitle: true, finalMarkdown: true },
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

  const res = await fetch(`${siteUrl}/wp-json/wp/v2/posts`, {
    method: "POST",
    headers: {
      authorization: basicAuth(wp.username, appPassword),
      "content-type": "application/json",
    },
    body: JSON.stringify({
      title,
      content: html,
      status: "publish",
    }),
  })

  const wpBody = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = wpBody?.message || `WordPress error (${res.status})`
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  return NextResponse.json({ ok: true, url: wpBody?.link })
}

