import { NextResponse } from "next/server"

import { clearSessionCookie, readSessionCookie } from "@/lib/auth/cookies"
import { deleteSessionByToken } from "@/lib/auth/session"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const token = await readSessionCookie()
  if (token) {
    await deleteSessionByToken(token).catch(() => {})
  }

  await clearSessionCookie()
  return NextResponse.redirect(new URL("/", req.url))
}
