import { IconBolt, IconChecklist, IconFingerprint, IconGauge, IconPrompt, IconSchema } from "@tabler/icons-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "AI Transcriber for YouTube",
    description: "Convert YouTube video transcripts into clean, structured blog outlines with our AI transcriber technology.",
    icon: IconSchema,
  },
  {
    title: "SEO-Friendly Content Generation",
    description: "Our SEO blog AI creates intent-aligned intros, proper H2/H3 hierarchy, FAQs, and keyword-optimized coverage for better rankings.",
    icon: IconPrompt,
  },
  {
    title: "Critique + rewrite",
    description: "A second pass improves clarity, structure, and on-page SEO—automatically.",
    icon: IconChecklist,
  },
  {
    title: "WordPress publishing",
    description: "Connect once and publish a completed article to WordPress without copy/paste.",
    icon: IconBolt,
  },
  {
    title: "Cost visibility",
    description: "Track estimated per-article generation cost and usage to stay in control.",
    icon: IconGauge,
  },
  {
    title: "Secure connections",
    description: "Sensitive WordPress credentials are stored encrypted in your database.",
    icon: IconFingerprint,
  },
]

export function LandingFeatureGrid() {
  return (
    <section id="features" className="py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">SEO-Friendly Blog Generation from YouTube Videos</h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Our AI transcriber and SEO blog AI tool creates structured, keyword-optimized articles perfect for search engines and readers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <Card key={f.title}>
              <CardHeader className="space-y-3">
                <div className="h-10 w-10 rounded-xl border bg-muted/40 flex items-center justify-center">
                  <f.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{f.description}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
