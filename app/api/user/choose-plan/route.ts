import { NextResponse } from "next/server"
import { z } from "zod"

import { requireApiUser } from "@/lib/auth/api"
import { prisma } from "@/lib/db/prisma"

export const runtime = "nodejs"

const bodySchema = z.object({
  plan: z.enum(["FREE", "PRO", "PREMIUM"]),
})

export async function POST(req: Request) {
  const auth = await requireApiUser()
  if (auth.errorResponse) return auth.errorResponse

  const body = await req.json().catch(() => ({}))
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

  const now = new Date()
  const plan = parsed.data.plan

  await prisma.user.update({
    where: { id: auth.user.id },
    data:
      plan === "FREE"
        ? { planTier: "FREE", planActiveUntil: null, planChosenAt: now }
        : { planChosenAt: now },
  })

  return NextResponse.json({ ok: true })
}

