import { IconCoins, IconFileText, IconNotes, IconWorld } from "@tabler/icons-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function formatUsd(value: number) {
  if (!Number.isFinite(value)) return "$0.00"
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 4 }).format(value)
}

function formatInt(value: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value)
}

export function DashboardMetrics(props: {
  totalArticles: number
  totalWords: number
  totalCostUsd: number
  connectedSites: number
}) {
  const items = [
    { title: "Articles", value: formatInt(props.totalArticles), icon: IconNotes },
    { title: "Total words", value: formatInt(props.totalWords), icon: IconFileText },
    { title: "Est. total cost", value: formatUsd(props.totalCostUsd), icon: IconCoins },
    { title: "WordPress sites", value: formatInt(props.connectedSites), icon: IconWorld },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((it) => (
        <Card key={it.title} className="overflow-hidden">
          <CardHeader className="border-b bg-muted/20 py-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>{it.title}</span>
              <it.icon className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-semibold tabular-nums">{it.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

