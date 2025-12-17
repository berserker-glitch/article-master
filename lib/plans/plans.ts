import { PlanTier, Prisma } from "@/lib/generated/prisma"
import { prisma } from "@/lib/db/prisma"

export type EffectivePlan = PlanTier

export function getEffectivePlan(user: { planTier: PlanTier; planActiveUntil: Date | null }): EffectivePlan {
  if (user.planTier === "FREE") return "FREE"
  if (!user.planActiveUntil) return "FREE"
  return user.planActiveUntil.getTime() > Date.now() ? user.planTier : "FREE"
}

export const PLAN_LIMITS: Record<PlanTier, { window: "rolling_7d" | "rolling_24h"; maxArticles: number }> = {
  FREE: { window: "rolling_7d", maxArticles: 1 },
  PRO: { window: "rolling_7d", maxArticles: 4 },
  PREMIUM: { window: "rolling_24h", maxArticles: 1 },
}

function windowStart(window: "rolling_7d" | "rolling_24h") {
  const now = Date.now()
  const ms = window === "rolling_7d" ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
  return new Date(now - ms)
}

export async function getUsageStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { planTier: true, planActiveUntil: true },
  })
  if (!user) return { ok: false as const, error: "User not found" }

  const plan = getEffectivePlan({ planTier: user.planTier, planActiveUntil: user.planActiveUntil })
  const limit = PLAN_LIMITS[plan]
  const start = windowStart(limit.window)

  const used = await prisma.article.count({
    where: { userId, createdAt: { gte: start } },
  })

  return { ok: true as const, plan, used, max: limit.maxArticles, window: limit.window, windowStart: start }
}

export async function enforceCanGenerateArticle(userId: string) {
  const status = await getUsageStatus(userId)
  if (!status.ok) return status
  if (status.used >= status.max) {
    return {
      ok: false as const,
      error:
        status.plan === "FREE"
          ? "Free plan limit reached (1 article per week). Upgrade to Pro or Premium to generate more."
          : status.plan === "PRO"
            ? "Pro plan limit reached (4 articles per week). Upgrade to Premium or wait for your limit to reset."
            : "Premium plan limit reached (1 article per day). Please wait for your limit to reset.",
      plan: status.plan,
      used: status.used,
      max: status.max,
      window: status.window,
    }
  }
  return status
}

export function isWpAllowed(plan: EffectivePlan) {
  return plan === "PRO" || plan === "PREMIUM"
}

export type PremiumGenerationPrefs = Prisma.JsonObject & {
  language?: string
  tone?: string
  include?: string
  exclude?: string
  additionalNotes?: string
  seoKeywords?: string
}

