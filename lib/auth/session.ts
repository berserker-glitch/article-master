import { prisma } from "@/lib/db/prisma"
import { AUTH_SESSION_REFRESH_SECONDS, AUTH_SESSION_TTL_SECONDS } from "@/lib/auth/constants"
import { tokenHash, randomToken } from "@/lib/auth/hash"
import { readSessionCookie, setSessionCookie } from "@/lib/auth/cookies"

export async function createSession(userId: string) {
  const token = randomToken(32)
  const now = new Date()
  const expiresAt = new Date(now.getTime() + AUTH_SESSION_TTL_SECONDS * 1000)

  await prisma.session.create({
    data: {
      userId,
      tokenHash: tokenHash(token),
      expiresAt,
      lastSeenAt: now,
    },
  })

  await setSessionCookie(token)
}

export async function deleteSessionByToken(token: string) {
  await prisma.session.deleteMany({ where: { tokenHash: tokenHash(token) } })
}

export async function getSessionUser() {
  const token = await readSessionCookie()
  if (!token) return null

  const now = new Date()
  const session = await prisma.session.findFirst({
    where: {
      tokenHash: tokenHash(token),
      expiresAt: { gt: now },
    },
    include: { user: true },
  })

  if (!session) return null

  // Sliding sessions: update lastSeenAt at most every N minutes.
  const msSinceLastSeen = now.getTime() - session.lastSeenAt.getTime()
  if (msSinceLastSeen > AUTH_SESSION_REFRESH_SECONDS * 1000) {
    await prisma.session.update({
      where: { id: session.id },
      data: { lastSeenAt: now },
    })
  }

  return session.user
}
