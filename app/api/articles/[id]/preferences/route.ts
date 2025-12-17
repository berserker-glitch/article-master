import { NextResponse } from "next/server"
import { z } from "zod"

import { requireApiUser } from "@/lib/auth/api"
import { prisma } from "@/lib/db/prisma"

export const runtime = "nodejs"

const prefsSchema = z.object({
  language: z.string().max(10).optional(),
  tone: z.string().max(500).optional(),
  include: z.string().max(2000).optional(),
  exclude: z.string().max(2000).optional(),
  additionalNotes: z.string().max(4000).optional(),
  seoKeywords: z.string().max(1000).optional(),
})

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiUser()
  if (auth.errorResponse) return auth.errorResponse

  const { id } = await ctx.params
  const body = await req.json().catch(() => ({}))
  const parsed = prefsSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

  const article = await prisma.article.findFirst({
    where: { id, userId: auth.user.id },
    select: { id: true, status: true },
  })

  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Only allow editing preferences if article hasn't started generating yet
  if (article.status !== "PENDING") {
    return NextResponse.json(
      { error: "Preferences can only be edited before generation starts" },
      { status: 400 }
    )
  }

  const updated = await prisma.article.update({
    where: { id },
    data: { generationPrefs: parsed.data },
    select: { generationPrefs: true },
  })

  return NextResponse.json({ ok: true, prefs: updated.generationPrefs })
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiUser()
  if (auth.errorResponse) return auth.errorResponse

  const { id } = await ctx.params

  const article = await prisma.article.findFirst({
    where: { id, userId: auth.user.id },
    select: { generationPrefs: true },
  })

  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json({ ok: true, prefs: article.generationPrefs ?? null })
}