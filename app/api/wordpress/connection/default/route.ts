import { NextResponse } from "next/server"

import { z } from "zod"

import { requireApiUser } from "@/lib/auth/api"
import { prisma } from "@/lib/db/prisma"

export const runtime = "nodejs"

const schema = z.object({
  connectionId: z.string().min(1),
})

export async function POST(req: Request) {
  const auth = await requireApiUser()
  if (auth.errorResponse) return auth.errorResponse

  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

  const connectionId = parsed.data.connectionId

  const existing = await prisma.wordPressConnection.findFirst({
    where: { id: connectionId, userId: auth.user.id },
    select: { id: true },
  })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await prisma.$transaction([
    prisma.wordPressConnection.updateMany({
      where: { userId: auth.user.id, isDefault: true },
      data: { isDefault: false },
    }),
    prisma.wordPressConnection.update({
      where: { id: connectionId },
      data: { isDefault: true },
    }),
  ])

  return NextResponse.json({ ok: true })
}

