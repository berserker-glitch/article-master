import { NextResponse } from "next/server"
import { z } from "zod"

import { requireApiUser } from "@/lib/auth/api"

export const runtime = "nodejs"

const bodySchema = z.object({
  plan: z.enum(["pro", "premium"]),
})

function requireEnv(name: string) {
  const raw = process.env[name]
  if (!raw) throw new Error(`Missing ${name}`)
  const v = String(raw).trim()
  // Hosting dashboards sometimes store quotes as part of the value.
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1).trim()
  }
  return v
}

export async function POST(req: Request) {
  const auth = await requireApiUser()
  if (auth.errorResponse) return auth.errorResponse

  const body = await req.json().catch(() => ({}))
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

  const customerEmail = typeof auth.user.email === "string" ? auth.user.email.trim() : ""
  if (!customerEmail) {
    return NextResponse.json({ error: "Missing account email" }, { status: 400 })
  }

  const secretKey = requireEnv("PADDLE_SECRET_KEY")
  const priceId =
    parsed.data.plan === "premium"
      ? requireEnv("PADDLE_PRICE_ID_PREMIUM_MONTHLY")
      : requireEnv("PADDLE_PRICE_ID_PRO_MONTHLY")

  const res = await fetch("https://api.paddle.com/transactions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${secretKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      items: [{ price_id: priceId, quantity: 1 }],
      collection_mode: "automatic",
      billing_details: { enable_checkout: true },
      customer: { email: customerEmail },
      custom_data: { userId: auth.user.id },
    }),
  })

  const payload = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message =
      payload?.error?.message ||
      payload?.error?.detail ||
      payload?.error?.description ||
      payload?.message ||
      "Failed to create checkout"
    return NextResponse.json(
      {
        error: message,
        code: payload?.error?.code ?? payload?.code ?? null,
        details: payload?.error?.errors ?? null,
        // Helpful for debugging: the raw Paddle error payload (no secrets included).
        paddle: payload?.error ?? payload ?? null,
      },
      { status: 400 }
    )
  }

  const url = payload?.data?.checkout?.url
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Checkout URL missing from Paddle response" }, { status: 500 })
  }

  return NextResponse.json({ ok: true, url })
}

