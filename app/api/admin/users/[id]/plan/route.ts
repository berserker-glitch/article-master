import { NextResponse } from "next/server"
import { z } from "zod"

import { requireApiUser } from "@/lib/auth/api"
import { prisma } from "@/lib/db/prisma"

export const runtime = "nodejs"

const bodySchema = z.object({
  planTier: z.enum(["FREE", "PRO", "PREMIUM"]),
  activeDays: z.number().int().min(1).max(3650).nullable().optional(),
})

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiUser()
  if (auth.errorResponse) return auth.errorResponse
  if (auth.user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await ctx.params
  const body = await req.json().catch(() => ({}))
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

  const planTier = parsed.data.planTier
  const now = Date.now()
  const activeUntil =
    planTier === "FREE"
      ? null
      : new Date(now + (parsed.data.activeDays ?? 30) * 24 * 60 * 60 * 1000)

  const updated = await prisma.user.update({
    where: { id },
    data: {
      planTier,
      planActiveUntil: activeUntil,
      planChosenAt: new Date(),
    },
    select: { planTier: true, planActiveUntil: true },
  })

  return NextResponse.json({
    ok: true,
    planTier: updated.planTier,
    planActiveUntil: updated.planActiveUntil ? updated.planActiveUntil.toISOString() : null,
  })
}

