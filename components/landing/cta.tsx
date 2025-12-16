import Link from "next/link"

import { IconArrowRight } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LandingCTA() {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-6xl px-6">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 right-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
          </div>
          <CardHeader className="relative">
            <CardTitle className="text-xl md:text-2xl">Ready to turn videos into SEO content?</CardTitle>
          </CardHeader>
          <CardContent className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              Generate long-form, publish-ready articles with strong structure, better depth, and cost visibility.
            </p>
            <Button asChild size="lg">
              <Link href="/signup">
                Get started <IconArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

