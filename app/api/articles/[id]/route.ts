import { NextResponse } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { requireApiUser } from "@/lib/auth/api"

export const runtime = "nodejs"

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiUser()
  if (auth.errorResponse) return auth.errorResponse

  const { id } = await ctx.params

  const article = await prisma.article.findFirst({
    where: { id, userId: auth.user.id },
    select: {
      id: true,
      status: true,
      sourceUrl: true,
      videoTitle: true,
      errorMessage: true,
      draftMarkdown: true,
      finalMarkdown: true,
      wordCount: true,
      estimatedCostUsd: true,
      progress: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json({ article })
}

