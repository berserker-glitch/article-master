"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Plan = "FREE" | "PRO" | "PREMIUM"

export function ChoosePlan({ currentPlan }: { currentPlan: Plan }) {
  const router = useRouter()
  const [loading, setLoading] = React.useState<Plan | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const chooseFree = async () => {
    setError(null)
    setLoading("FREE")
    try {
      const res = await fetch("/api/user/choose-plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: "FREE" }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error || "Failed to save plan")
      router.push("/dashboard")
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save plan")
      setLoading(null)
    }
  }

  const startPaid = async (plan: "PRO" | "PREMIUM") => {
    setError(null)
    setLoading(plan)
    try {
      // Mark that the user picked a plan (so we don't keep forcing this page).
      await fetch("/api/user/choose-plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan }),
      })

      const res = await fetch("/api/paddle/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: plan === "PRO" ? "pro" : "premium" }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error || "Checkout failed")
      if (typeof body?.url !== "string") throw new Error("Checkout URL missing")
      window.location.href = body.url
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed")
      setLoading(null)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-3 items-stretch">
      <PlanCard
        title="Free"
        price="$0"
        subtitle="Basic article generation"
        features={["1 article per week", "Basic article generation from YouTube", "No WordPress linking"]}
        cta={
          <Button onClick={chooseFree} disabled={loading !== null || currentPlan !== "FREE"}>
            {currentPlan === "FREE" ? (loading === "FREE" ? "Saving…" : "Continue on Free") : "Not available"}
          </Button>
        }
      />

      <PlanCard
        title="Pro"
        price="$8/mo"
        subtitle="More usage + WordPress"
        features={["4 articles per week", "Higher quality generation", "Link & publish to WordPress"]}
        cta={
          <Button onClick={() => startPaid("PRO")} disabled={loading !== null || currentPlan === "PRO" || currentPlan === "PREMIUM"}>
            {currentPlan === "PRO" ? "Current plan" : currentPlan === "PREMIUM" ? "Included in Premium" : loading === "PRO" ? "Redirecting…" : "Subscribe to Pro"}
          </Button>
        }
      />

      <PlanCard
        title="Premium"
        price="$12/mo"
        subtitle="Max usage + customization"
        features={[
          "1 article per day",
          "Best quality generation",
          "Link & publish to WordPress",
          "Customizable generation preferences (tone, include/exclude, SEO keywords)",
        ]}
        cta={
          <Button onClick={() => startPaid("PREMIUM")} disabled={loading !== null || currentPlan === "PREMIUM"}>
            {currentPlan === "PREMIUM" ? "Current plan" : loading === "PREMIUM" ? "Redirecting…" : "Subscribe to Premium"}
          </Button>
        }
      />

      {error && <p className="text-sm text-destructive md:col-span-3">{error}</p>}
    </div>
  )
}

function PlanCard({
  title,
  price,
  subtitle,
  features,
  cta,
}: {
  title: string
  price: string
  subtitle: string
  features: string[]
  cta: React.ReactNode
}) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-baseline justify-between gap-3">
          <span>{title}</span>
          <span className="text-sm font-normal text-muted-foreground">{price}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="text-sm space-y-2">
          {features.map((f) => (
            <li key={f} className="text-muted-foreground">
              {f}
            </li>
          ))}
        </ul>
        <div>{cta}</div>
      </CardContent>
    </Card>
  )
}

