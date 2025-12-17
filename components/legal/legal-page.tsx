import * as React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LegalPage(props: { title: string; content: string }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">{props.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap text-sm leading-6 text-foreground">{props.content}</pre>
        </CardContent>
      </Card>
    </div>
  )
}

