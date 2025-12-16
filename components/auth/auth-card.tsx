import * as React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AuthCard(props: { title: string; children: React.ReactNode }) {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent>{props.children}</CardContent>
    </Card>
  )
}
