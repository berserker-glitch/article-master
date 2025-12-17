import { IconClipboardText, IconSparkles, IconWorldUpload } from "@tabler/icons-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const steps = [
  {
    title: "Paste YouTube URL",
    description: "Copy and paste your YouTube video URL into our AI transcriber. We'll automatically extract the transcript and video metadata for processing.",
    icon: IconClipboardText,
    iconAlt: "YouTube URL input icon",
    step: 1
  },
  {
    title: "AI Content Generation",
    description: "Our SEO blog AI analyzes the transcript, creates structured outlines, and generates comprehensive, keyword-optimized blog articles with proper SEO elements.",
    icon: IconSparkles,
    iconAlt: "AI content generation icon",
    step: 2
  },
  {
    title: "WordPress Publishing",
    description: "Connect your WordPress site and publish SEO-friendly articles directly from our platform. No copy/paste required - everything is automated.",
    icon: IconWorldUpload,
    iconAlt: "WordPress publishing icon",
    step: 3
  },
]

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-14" aria-labelledby="how-it-works-heading">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div className="space-y-1">
            <h2 id="how-it-works-heading" className="text-2xl md:text-3xl font-semibold tracking-tight">
              Convert YouTube Videos to Blog Articles in 3 Simple Steps
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Our AI transcriber and SEO blog AI make it effortless to transform video content into high-quality, search-optimized blog posts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((s) => (
            <Card key={s.title} className="h-full transition-all hover:shadow-md">
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold"
                    aria-label={`Step ${s.step}`}
                  >
                    {s.step}
                  </div>
                  <div
                    className="h-10 w-10 rounded-xl border bg-muted/40 flex items-center justify-center"
                    role="img"
                    aria-label={s.iconAlt}
                  >
                    <s.icon className="h-5 w-5 text-foreground" aria-hidden="true" />
                  </div>
                </div>
                <CardTitle className="text-base">{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{s.description}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}