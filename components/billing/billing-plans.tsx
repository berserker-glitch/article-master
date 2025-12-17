"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Plan = "FREE" | "PRO" | "PREMIUM"

export function BillingPlans({ currentPlan }: { currentPlan: Plan }) {
  const [loadingPlan, setLoadingPlan] = React.useState<Plan | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const startCheckout = async (plan: "pro" | "premium") => {
    setError(null)
    setLoadingPlan(plan === "pro" ? "PRO" : "PREMIUM")
    try {
      const res = await fetch("/api/paddle/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error || "Checkout failed")
      if (typeof body?.url !== "string") throw new Error("Checkout URL missing")
      window.location.href = body.url
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed")
      setLoadingPlan(null)
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
          <Button variant={currentPlan === "FREE" ? "secondary" : "outline"} disabled>
            {currentPlan === "FREE" ? "Current plan" : "Included"}
          </Button>
        }
      />

      <PlanCard
        title="Pro"
        price="$8/mo"
        subtitle="More usage + WordPress"
        features={["4 articles per week", "Higher quality generation", "Link & publish to WordPress"]}
        cta={
          <Button
            onClick={() => startCheckout("pro")}
            disabled={currentPlan === "PRO" || currentPlan === "PREMIUM" || loadingPlan === "PRO"}
          >
            {currentPlan === "PRO" ? "Current plan" : currentPlan === "PREMIUM" ? "Included in Premium" : loadingPlan === "PRO" ? "Redirecting…" : "Upgrade to Pro"}
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
          <Button onClick={() => startCheckout("premium")} disabled={currentPlan === "PREMIUM" || loadingPlan === "PREMIUM"}>
            {currentPlan === "PREMIUM" ? "Current plan" : loadingPlan === "PREMIUM" ? "Redirecting…" : "Upgrade to Premium"}
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

