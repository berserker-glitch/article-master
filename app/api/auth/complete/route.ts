import { NextResponse } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { consumeSignupToken } from "@/lib/auth/signup"
import { completeSignupSchema } from "@/lib/auth/validators"
import { hashPassword } from "@/lib/auth/password"
import { createSession } from "@/lib/auth/session"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const parsed = completeSignupSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { token, username, password } = parsed.data

    const signup = await consumeSignupToken(token)
    if (!signup) {
      return NextResponse.json({ error: "Link expired or already used" }, { status: 400 })
    }

    const email = signup.email.toLowerCase()

    const existingEmail = await prisma.user.findUnique({ where: { email } })
    if (existingEmail) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } })
    if (existingUsername) {
      return NextResponse.json({ error: "Username already in use" }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        emailVerifiedAt: new Date(),
      },
    })

    await createSession(user.id)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
