import { IconBolt, IconChecklist, IconFingerprint, IconGauge, IconPrompt, IconSchema } from "@tabler/icons-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "AI Transcriber for YouTube",
    description: "Convert YouTube video transcripts into clean, structured blog outlines with our advanced AI transcriber technology.",
    icon: IconSchema,
    iconAlt: "AI transcription icon"
  },
  {
    title: "SEO-Friendly Content Generation",
    description: "Our SEO blog AI creates intent-aligned intros, H2/H3 hierarchy, FAQs, and keyword-aware coverage for better search rankings.",
    icon: IconPrompt,
    iconAlt: "SEO content generation icon"
  },
  {
    title: "Critique + Rewrite Pipeline",
    description: "Multi-step AI process critiques and rewrites content automatically to improve clarity, structure, and on-page SEO performance.",
    icon: IconChecklist,
    iconAlt: "AI critique and rewrite icon"
  },
  {
    title: "WordPress Publishing Integration",
    description: "Connect once and publish SEO-optimized articles directly to WordPress without copy/paste. Perfect for content creators.",
    icon: IconBolt,
    iconAlt: "WordPress publishing icon"
  },
  {
    title: "Cost Transparency & Tracking",
    description: "Monitor AI generation costs per article and track usage across your workspace with detailed analytics and reporting.",
    icon: IconGauge,
    iconAlt: "Cost tracking and analytics icon"
  },
  {
    title: "Secure Data Encryption",
    description: "Enterprise-grade encryption protects your sensitive WordPress credentials and personal data throughout the platform.",
    icon: IconFingerprint,
    iconAlt: "Security and encryption icon"
  },
]

export function LandingFeatureGrid() {
  return (
    <section id="features" className="py-14" aria-labelledby="features-heading">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div className="space-y-1">
            <h2 id="features-heading" className="text-2xl md:text-3xl font-semibold tracking-tight">
              Advanced AI Features for Content Creation
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Powerful AI tools designed specifically for SEO-friendly blog generation from YouTube videos. Transform video content into high-quality, search-optimized articles.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <Card key={f.title} className="h-full transition-all hover:shadow-md">
              <CardHeader className="space-y-3">
                <div
                  className="h-10 w-10 rounded-xl border bg-muted/40 flex items-center justify-center"
                  role="img"
                  aria-label={f.iconAlt}
                >
                  <f.icon className="h-5 w-5" aria-hidden="true" />
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