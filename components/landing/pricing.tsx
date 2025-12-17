import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LandingPricing() {
  return (
    <section id="pricing" className="py-20 border-t">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Plans</h2>
          <p className="text-muted-foreground max-w-2xl">
            Start free, then upgrade when you need higher limits, WordPress publishing, or Premium customization.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 items-stretch">
          <PlanCard
            title="Free"
            price="$0"
            subtitle="Basic article generation"
            features={["1 article per week", "Basic article generation from YouTube", "No WordPress linking"]}
            cta={
              <Button asChild variant="secondary">
                <Link href="/signup">Get started</Link>
              </Button>
            }
          />

          <PlanCard
            title="Pro"
            price="$8/mo"
            subtitle="More usage + WordPress"
            features={["4 articles per week", "Higher quality generation", "Link & publish to WordPress"]}
            cta={
              <Button asChild>
                <Link href="/signup?plan=pro">Choose Pro</Link>
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
              <Button asChild>
                <Link href="/signup?plan=premium">Choose Premium</Link>
              </Button>
            }
          />
        </div>
      </div>
    </section>
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

