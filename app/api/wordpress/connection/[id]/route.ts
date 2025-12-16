import { NextResponse } from "next/server"

import { requireApiUser } from "@/lib/auth/api"
import { prisma } from "@/lib/db/prisma"

export const runtime = "nodejs"

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiUser()
  if (auth.errorResponse) return auth.errorResponse

  const { id } = await ctx.params

  const existing = await prisma.wordPressConnection.findFirst({
    where: { id, userId: auth.user.id },
    select: { id: true, isDefault: true },
  })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await prisma.wordPressConnection.delete({ where: { id } })

  // If the deleted connection was default, set another one as default (if any).
  if (existing.isDefault) {
    const next = await prisma.wordPressConnection.findFirst({
      where: { userId: auth.user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    })
    if (next) {
      await prisma.wordPressConnection.update({ where: { id: next.id }, data: { isDefault: true } })
    }
  }

  return NextResponse.json({ ok: true })
}

