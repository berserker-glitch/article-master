import { IconClipboardText, IconSparkles, IconWorldUpload } from "@tabler/icons-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const steps = [
  {
    title: "Paste a YouTube link",
    description: "We fetch subtitles + video metadata and turn it into structured source material.",
    icon: IconClipboardText,
  },
  {
    title: "Generate long-form SEO content",
    description: "A multi-step pipeline writes, critiques, and rewrites into a polished, publish-ready article.",
    icon: IconSparkles,
  },
  {
    title: "Publish to WordPress",
    description: "Connect your site once, then publish when the article is complete—without copy/paste.",
    icon: IconWorldUpload,
  },
]

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">How it works</h2>
            <p className="text-sm md:text-base text-muted-foreground">
              From transcript to a structured, SEO-first article—then straight to WordPress.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((s) => (
            <Card key={s.title} className="h-full">
              <CardHeader className="space-y-3">
                <div className="h-10 w-10 rounded-xl border bg-muted/40 flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-foreground" />
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

