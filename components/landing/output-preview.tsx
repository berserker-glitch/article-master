import { IconChartBar, IconHash, IconListDetails, IconWriting } from "@tabler/icons-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const bullets = [
  {
    title: "1500+ words, structured",
    description: "Clear H2/H3 sections, short paragraphs, and skimmable formatting.",
    icon: IconWriting,
  },
  {
    title: "SEO-friendly structure",
    description: "Our SEO blog AI creates intent-matching intros, key takeaways, FAQs, and conversion-focused conclusions optimized for search engines.",
    icon: IconListDetails,
  },
  {
    title: "Cost visibility",
    description: "We estimate the generation cost per article so you can track usage.",
    icon: IconChartBar,
  },
  {
    title: "Keyword-friendly",
    description: "Natural keyword placement, semantic coverage, and internal-link suggestions.",
    icon: IconHash,
  },
]

export function LandingOutputPreview() {
  return (
    <section id="output" className="py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2">
              <Badge variant="secondary">What you get</Badge>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              SEO-Friendly Blog Articles Ready for Publishing
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Our AI transcriber and SEO blog AI tool transforms YouTube video transcripts into complete, SEO-optimized articles designed to rank in search engines.
            </p>

            <div className="grid gap-3 pt-2">
              {bullets.map((b) => (
                <div key={b.title} className="flex gap-3">
                  <div className="mt-0.5 h-9 w-9 rounded-xl border bg-muted/40 flex items-center justify-center shrink-0">
                    <b.icon className="h-5 w-5" />
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
              <CardTitle className="text-base">Example outline</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-5 grid gap-4 text-sm">
                <div className="space-y-1">
                  <div className="font-medium">H1: A Practical Guide to X (2025)</div>
                  <div className="text-muted-foreground">Meta description: concise, keyword-aware summary</div>
                </div>
                <div className="grid gap-2">
                  <div className="font-medium">Table of contents</div>
                  <ul className="list-disc pl-5 text-muted-foreground">
                    <li>What is X?</li>
                    <li>Why X matters</li>
                    <li>Step-by-step process</li>
                    <li>Common mistakes</li>
                    <li>FAQ</li>
                  </ul>
                </div>
                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="font-medium mb-1">Key takeaways</div>
                  <ul className="list-disc pl-5 text-muted-foreground">
                    <li>Actionable steps and checklists</li>
                    <li>Clear examples and definitions</li>
                    <li>Conclusion with next actions</li>
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
