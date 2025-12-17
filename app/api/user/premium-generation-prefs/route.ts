import { NextResponse } from "next/server"
import { z } from "zod"

import { requireApiUser } from "@/lib/auth/api"
import { prisma } from "@/lib/db/prisma"
import { getEffectivePlan } from "@/lib/plans/plans"

export const runtime = "nodejs"

const prefsSchema = z.object({
  tone: z.string().max(500).optional(),
  include: z.string().max(2000).optional(),
  exclude: z.string().max(2000).optional(),
  additionalNotes: z.string().max(4000).optional(),
  seoKeywords: z.string().max(1000).optional(),
})

export async function GET() {
  const auth = await requireApiUser()
  if (auth.errorResponse) return auth.errorResponse

  const plan = getEffectivePlan({ planTier: auth.user.planTier, planActiveUntil: auth.user.planActiveUntil })
  if (plan !== "PREMIUM") {
    return NextResponse.json({ error: "Premium feature: customizable generation preferences." }, { status: 403 })
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.user.id },
    select: { premiumGenerationPrefs: true },
  })

  return NextResponse.json({ ok: true, prefs: user?.premiumGenerationPrefs ?? null })
}

export async function POST(req: Request) {
  const auth = await requireApiUser()
  if (auth.errorResponse) return auth.errorResponse

  const plan = getEffectivePlan({ planTier: auth.user.planTier, planActiveUntil: auth.user.planActiveUntil })
  if (plan !== "PREMIUM") {
    return NextResponse.json({ error: "Premium feature: customizable generation preferences." }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const parsed = prefsSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

  const updated = await prisma.user.update({
    where: { id: auth.user.id },
    data: { premiumGenerationPrefs: parsed.data },
    select: { premiumGenerationPrefs: true },
  })

  return NextResponse.json({ ok: true, prefs: updated.premiumGenerationPrefs })
}

