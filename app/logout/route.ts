import { NextResponse } from "next/server"

import { clearSessionCookie, readSessionCookie } from "@/lib/auth/cookies"
import { deleteSessionByToken } from "@/lib/auth/session"

export const runtime = "nodejs"

function requestOrigin(req: Request) {
  // Prefer proxy-provided headers so we don't accidentally redirect to an internal host (e.g. localhost).
  const proto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim()
  const host = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim() || req.headers.get("host")?.trim()
  if (proto && host) return `${proto}://${host}`
  if (host) return `https://${host}`
  // Fallback to req.url origin if headers are missing (dev/local)
  return new URL(req.url).origin
}

export async function POST(req: Request) {
  const token = await readSessionCookie()
  if (token) {
    await deleteSessionByToken(token).catch(() => {})
  }

  await clearSessionCookie()
  return NextResponse.redirect(new URL("/", requestOrigin(req)))
}
