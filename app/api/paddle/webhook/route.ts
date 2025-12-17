import { NextResponse } from "next/server"
import crypto from "crypto"

import { prisma } from "@/lib/db/prisma"
import { PlanTier } from "@/lib/generated/prisma"

export const runtime = "nodejs"

type UnknownRecord = Record<string, unknown>

function isRecord(v: unknown): v is UnknownRecord {
  return !!v && typeof v === "object"
}

function requireEnv(name: string) {
  const v = process.env[name]
  if (!v) throw new Error(`Missing ${name}`)
  return v
}

function parseSignatureHeader(header: string | null) {
  if (!header) return null
  const parts = header.split(";").map((p) => p.trim())
  const kv = Object.fromEntries(parts.map((p) => p.split("=").map((x) => x.trim())))
  const ts = kv.ts
  const h1 = kv.h1
  if (!ts || !h1) return null
  return { ts, h1 }
}

function safeEqualHex(a: string, b: string) {
  try {
    const ba = Buffer.from(a, "hex")
    const bb = Buffer.from(b, "hex")
    if (ba.length !== bb.length) return false
    return crypto.timingSafeEqual(ba, bb)
  } catch {
    return false
  }
}

function extractUserId(data: unknown): string | null {
  if (!isRecord(data)) return null
  const cd = data["custom_data"]
  if (!isRecord(cd)) return null
  const v = cd["userId"] ?? cd["user_id"] ?? cd["userid"]
  return typeof v === "string" && v ? v : null
}

function extractPriceId(data: unknown): string | null {
  if (!isRecord(data)) return null
  const items = data["items"]
  const first = Array.isArray(items) ? items[0] : null
  const firstPrice = isRecord(first) ? first["price"] : null

  const price =
    (isRecord(firstPrice) ? firstPrice["id"] : null) ??
    (isRecord(first) ? first["price_id"] : null) ??
    (isRecord(first) ? first["priceId"] : null) ??
    (isRecord(data["price"]) ? (data["price"] as UnknownRecord)["id"] : null) ??
    data["price_id"] ??
    data["priceId"]

  return typeof price === "string" && price ? price : null
}

function tierFromPriceId(priceId: string | null): PlanTier | null {
  if (!priceId) return null
  const pro = process.env.PADDLE_PRICE_ID_PRO_MONTHLY
  const premium = process.env.PADDLE_PRICE_ID_PREMIUM_MONTHLY
  if (pro && priceId === pro) return "PRO"
  if (premium && priceId === premium) return "PREMIUM"
  return null
}

function parseEndsAt(data: unknown): Date | null {
  if (!isRecord(data)) return null
  const currentBillingPeriod = data["current_billing_period"]
  const billingPeriod = data["billing_period"]
  const endsAt =
    (isRecord(currentBillingPeriod) ? currentBillingPeriod["ends_at"] : null) ??
    (isRecord(billingPeriod) ? billingPeriod["ends_at"] : null) ??
    data["current_billing_period_ends_at"] ??
    data["ends_at"]
  if (typeof endsAt !== "string" || !endsAt) return null
  const d = new Date(endsAt)
  return Number.isFinite(d.getTime()) ? d : null
}

export async function POST(req: Request) {
  const secret = requireEnv("PADDLE_WEBHOOK_SECRET")
  const signature = parseSignatureHeader(req.headers.get("paddle-signature"))
  if (!signature) return NextResponse.json({ error: "Missing or invalid Paddle-Signature" }, { status: 400 })

  const rawBody = await req.text()
  const signedPayload = `${signature.ts}:${rawBody}`
  const computed = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex")
  if (!safeEqualHex(computed, signature.h1)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const event = JSON.parse(rawBody || "{}")
  const eventType: string = isRecord(event) ? String(event["event_type"] ?? event["eventType"] ?? "") : ""
  const data = isRecord(event) ? event["data"] : null

  // We only handle subscription events for now.
  if (!isRecord(data)) return NextResponse.json({ ok: true })

  const userId = extractUserId(data)
  if (!userId) return NextResponse.json({ ok: true })

  const priceId = extractPriceId(data)
  const tier = tierFromPriceId(priceId)
  const endsAt = parseEndsAt(data)

  const subscriptionId = typeof data["id"] === "string" ? data["id"] : null
  const customerId =
    typeof data["customer_id"] === "string"
      ? (data["customer_id"] as string)
      : isRecord(data["customer"]) && typeof data["customer"]["id"] === "string"
        ? (data["customer"]["id"] as string)
        : null
  const status = typeof data["status"] === "string" ? (data["status"] as string) : null

  if (eventType.startsWith("subscription.") && tier) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        planTier: tier,
        planActiveUntil: endsAt,
        paddleSubscriptionId: subscriptionId,
        paddleCustomerId: customerId,
        paddlePriceId: priceId,
        paddleSubscriptionStatus: status,
      },
    })
  }

  // If Paddle says it's been deleted/canceled without a valid period end, downgrade immediately.
  if (
    eventType === "subscription.deleted" ||
    (eventType === "subscription.canceled" && !endsAt) ||
    (eventType === "subscription.cancelled" && !endsAt)
  ) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        planTier: "FREE",
        planActiveUntil: null,
        paddleSubscriptionStatus: status || "canceled",
      },
    })
  }

  return NextResponse.json({ ok: true })
}

