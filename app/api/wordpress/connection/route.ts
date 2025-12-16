import { NextResponse } from "next/server"

import { z } from "zod"

import { requireApiUser } from "@/lib/auth/api"
import { prisma } from "@/lib/db/prisma"
import { encryptString } from "@/lib/crypto/encryption"

export const runtime = "nodejs"

const schema = z.object({
  siteUrl: z.string().url(),
  username: z.string().min(1),
  appPassword: z.string().min(8),
})

export async function GET(_req: Request) {
  const auth = await requireApiUser()
  if (auth.errorResponse) return auth.errorResponse

  const connections = await prisma.wordPressConnection.findMany({
    where: { userId: auth.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    select: { id: true, siteUrl: true, username: true, isDefault: true, createdAt: true },
  })

  return NextResponse.json({ connections })
}

export async function POST(req: Request) {
  const auth = await requireApiUser()
  if (auth.errorResponse) return auth.errorResponse

  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const siteUrl = parsed.data.siteUrl.replace(/\/$/, "")
  const username = parsed.data.username

  let encryptedAppPassword: string
  try {
    encryptedAppPassword = encryptString(parsed.data.appPassword)
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Encryption error"
    // Make misconfiguration errors obvious to the UI instead of returning a generic 500.
    return NextResponse.json(
      {
        error:
          msg === "APP_ENCRYPTION_KEY must be 32 bytes base64"
            ? "Server misconfigured: APP_ENCRYPTION_KEY must be 32 bytes base64. Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\" and set it in .env, then restart dev server."
            : msg,
      },
      { status: 400 }
    )
  }

  const existingDefault = await prisma.wordPressConnection.findFirst({
    where: { userId: auth.user.id, isDefault: true },
    select: { id: true },
  })

  const shouldBeDefault = !existingDefault

  const connection = await prisma.wordPressConnection.upsert({
    where: { userId_siteUrl: { userId: auth.user.id, siteUrl } },
    create: {
      userId: auth.user.id,
      siteUrl,
      username,
      encryptedAppPassword,
      isDefault: shouldBeDefault,
    },
    update: {
      username,
      encryptedAppPassword,
    },
    select: { id: true, siteUrl: true, username: true, isDefault: true, createdAt: true },
  })

  return NextResponse.json({ ok: true, connection })
}

