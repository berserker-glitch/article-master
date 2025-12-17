import * as React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function LegalPage(props: { title: string; content: string }) {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-4">
          <Button asChild variant="ghost">
            <Link href="/">Back to home</Link>
          </Button>
        </div>

        <div className="mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">{props.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm leading-6 text-foreground">{props.content}</pre>
            </CardContent>
          </Card>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}

