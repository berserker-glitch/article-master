import { NextResponse } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { loginRequestSchema } from "@/lib/auth/validators"
import { verifyPassword } from "@/lib/auth/password"
import { createSession } from "@/lib/auth/session"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const parsed = loginRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const email = parsed.data.email.toLowerCase()
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const ok = await verifyPassword(parsed.data.password, user.passwordHash)
    if (!ok) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    await createSession(user.id)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
