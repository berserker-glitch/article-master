import { prisma } from "@/lib/db/prisma"
import { SIGNUP_TOKEN_TTL_SECONDS } from "@/lib/auth/constants"
import { randomToken, tokenHash } from "@/lib/auth/hash"

export async function createSignupToken(email: string) {
  const token = randomToken(32)
  const expiresAt = new Date(Date.now() + SIGNUP_TOKEN_TTL_SECONDS * 1000)

  await prisma.signupToken.create({
    data: {
      email,
      tokenHash: tokenHash(token),
      expiresAt,
    },
  })

  return { token, expiresAt }
}

export async function consumeSignupToken(token: string) {
  const now = new Date()
  const record = await prisma.signupToken.findFirst({
    where: {
      tokenHash: tokenHash(token),
      expiresAt: { gt: now },
      usedAt: null,
    },
  })

  if (!record) return null

  await prisma.signupToken.update({
    where: { id: record.id },
    data: { usedAt: now },
  })

  return record
}
