import { IconChartBar, IconHash, IconListDetails, IconWriting } from "@tabler/icons-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const bullets = [
  {
    title: "1500+ Words, Structured Content",
    description: "Professional blog articles with clear H2/H3 sections, short paragraphs, and skimmable formatting optimized for reader engagement.",
    icon: IconWriting,
    iconAlt: "Long-form content writing icon"
  },
  {
    title: "SEO-Friendly Article Structure",
    description: "Our SEO blog AI creates intent-matching introductions, compelling key takeaways, comprehensive FAQ sections, and conversion-focused conclusions.",
    icon: IconListDetails,
    iconAlt: "SEO article structure icon"
  },
  {
    title: "Cost Transparency & Analytics",
    description: "Detailed cost tracking per article with usage analytics to help you optimize your content creation budget and ROI.",
    icon: IconChartBar,
    iconAlt: "Cost tracking and analytics icon"
  },
  {
    title: "Keyword Optimization",
    description: "Strategic keyword placement throughout the article with semantic coverage and internal linking suggestions for better search performance.",
    icon: IconHash,
    iconAlt: "Keyword optimization icon"
  },
]

export function LandingOutputPreview() {
  return (
    <section id="output" className="py-14" aria-labelledby="output-heading">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2">
              <Badge variant="secondary">Professional Output</Badge>
            </div>
            <h2 id="output-heading" className="text-2xl md:text-3xl font-semibold tracking-tight">
              SEO-Friendly Blog Articles Ready for Publishing
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Our AI transcriber and SEO blog AI tool transforms YouTube video transcripts into complete, SEO-optimized articles designed to rank in search engines and engage readers.
            </p>

            <div className="grid gap-3 pt-2">
              {bullets.map((b) => (
                <div key={b.title} className="flex gap-3">
                  <div
                    className="mt-0.5 h-9 w-9 rounded-xl border bg-muted/40 flex items-center justify-center shrink-0"
                    role="img"
                    aria-label={b.iconAlt}
                  >
                    <b.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-medium">{b.title}</div>
                    <div className="text-sm text-muted-foreground">{b.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-base">Example SEO-Optimized Article Structure</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-5 grid gap-4 text-sm">
                <div className="space-y-1">
                  <div className="font-medium">H1: Complete Guide to AI Blog Writing (2025)</div>
                  <div className="text-muted-foreground">SEO-optimized meta description with target keywords</div>
                </div>
                <div className="grid gap-2">
                  <div className="font-medium">Strategic Table of Contents</div>
                  <ul className="list-disc pl-5 text-muted-foreground">
                    <li>What is AI-powered blog writing?</li>
                    <li>Benefits of using AI for content creation</li>
                    <li>Step-by-step implementation guide</li>
                    <li>Best practices and optimization tips</li>
                    <li>Future of AI in blogging</li>
                  </ul>
                </div>
                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="font-medium mb-1">Key Takeaways Section</div>
                  <ul className="list-disc pl-5 text-muted-foreground">
                    <li>AI can generate high-quality, SEO-friendly content</li>
                    <li>Proper keyword research is still essential</li>
                    <li>Human editing ensures quality and accuracy</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}