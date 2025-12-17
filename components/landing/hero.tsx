import Link from "next/link"

import { IconArrowRight, IconChartBar, IconFileText, IconWorldUpload } from "@tabler/icons-react"

import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pt-14 pb-10 md:pt-20 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">SEO-friendly</Badge>
              <Badge variant="secondary">YouTube to blog</Badge>
              <Badge variant="secondary">AI transcriber</Badge>
              <Badge variant="secondary">SEO blog AI</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              SEO-Friendly AI Blog Generator: Convert YouTube Videos to Blog Articles
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Transform YouTube videos into SEO-friendly, long-form blog articles with our AI transcriber. Our SEO blog AI tool extracts transcripts, creates structured outlines, and generates optimized content ready for WordPress publishing.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link className={cn(buttonVariants({ size: "lg" }))} href="/signup">
                Get started <IconArrowRight className="ml-2 h-4 w-4 inline" />
              </Link>
              <Link className={cn(buttonVariants({ variant: "secondary", size: "lg" }))} href="/login">
                Sign in
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-sm">
              <div className="rounded-xl border bg-muted/20 p-4">
                <div className="font-medium">Long-form output</div>
                <div className="text-muted-foreground">1500+ words, skimmable sections</div>
              </div>
              <div className="rounded-xl border bg-muted/20 p-4">
                <div className="font-medium">SEO structure</div>
                <div className="text-muted-foreground">FAQs, takeaways, intent match</div>
              </div>
              <div className="rounded-xl border bg-muted/20 p-4">
                <div className="font-medium">Publish-ready</div>
                <div className="text-muted-foreground">One-click WordPress publish</div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-muted/20">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Generation preview</span>
                  <Badge>Complete</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 grid gap-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <IconFileText className="h-4 w-4" />
                      Words
                    </div>
                    <div className="text-lg font-semibold">1,862</div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <IconChartBar className="h-4 w-4" />
                      Est. cost
                    </div>
                    <div className="text-lg font-semibold">$0.03</div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <IconWorldUpload className="h-4 w-4" />
                      Publish
                    </div>
                    <div className="text-lg font-semibold">Ready</div>
                  </div>
                </div>

                <div className="rounded-xl border bg-background p-4">
                  <div className="font-medium mb-1">A Practical Guide to X (2025)</div>
                  <div className="text-sm text-muted-foreground">
                    Intro that matches search intent, scannable headings, and FAQs to capture long‑tail traffic.
                  </div>
                  <div className="mt-3 grid gap-2 text-sm">
                    <div className="h-2 w-11/12 rounded bg-muted" />
                    <div className="h-2 w-10/12 rounded bg-muted" />
                    <div className="h-2 w-9/12 rounded bg-muted" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-xs text-muted-foreground">
              Output shown is an example. Actual content is generated from the provided transcript.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
