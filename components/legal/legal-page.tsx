import * as React from "react"

import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LegalPageProps {
  title: string
  content: string
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export function LegalPage({ title, content, breadcrumbs = [{ label: "Home", href: "/" }] }: LegalPageProps) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbs} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm leading-6 text-foreground font-sans">
              {content}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}