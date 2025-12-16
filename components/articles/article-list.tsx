import Link from "next/link"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export type ArticleListItem = {
  id: string
  status: "PENDING" | "RUNNING" | "COMPLETE" | "FAILED"
  videoTitle: string | null
  createdAt: Date
  wordCount?: number | null
  estimatedCostUsd?: number | null
}

function formatUsd(value: number) {
  if (!Number.isFinite(value)) return "$0.00"
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 4 }).format(value)
}

export function ArticleList(props: { items: ArticleListItem[] }) {
  if (props.items.length === 0) {
    return <p className="text-sm text-muted-foreground">No articles yet.</p>
  }

  return (
    <div className="grid gap-4">
      {props.items.map((a) => (
        <Link key={a.id} href={`/articles/${a.id}`} className="block">
          <Card className="hover:bg-muted/30 transition-colors">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="text-base truncate">
                  {a.videoTitle || "Untitled article"}
                </CardTitle>
                <div className="mt-1 text-xs text-muted-foreground flex flex-wrap gap-x-2 gap-y-1">
                  <span>Created {a.createdAt.toLocaleString()}</span>
                  {a.wordCount ? <span>• {a.wordCount.toLocaleString()} words</span> : null}
                  {a.estimatedCostUsd != null ? <span>• {formatUsd(a.estimatedCostUsd)}</span> : null}
                </div>
              </div>
              <Badge
                variant={
                  a.status === "COMPLETE"
                    ? "default"
                    : a.status === "FAILED"
                      ? "destructive"
                      : "secondary"
                }
              >
                {a.status}
              </Badge>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}

