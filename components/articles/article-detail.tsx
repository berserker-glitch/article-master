import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Markdown } from "@/components/articles/markdown"

export type ArticleDetailModel = {
  id: string
  status: "PENDING" | "RUNNING" | "COMPLETE" | "FAILED"
  sourceUrl: string
  videoTitle: string | null
  errorMessage: string | null
  draftMarkdown: string | null
  finalMarkdown: string | null
  wordCount?: number | null
  estimatedCostUsd?: number | null
  createdAt: Date
}

function formatUsd(value: number) {
  if (!Number.isFinite(value)) return "$0.00"
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 4 }).format(value)
}

export function ArticleDetail(props: { article: ArticleDetailModel }) {
  const a = props.article
  const markdown = a.finalMarkdown || a.draftMarkdown

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{a.videoTitle || "Article"}</CardTitle>
            <div className="text-sm text-muted-foreground break-all">{a.sourceUrl}</div>
            <div className="text-xs text-muted-foreground flex flex-wrap gap-x-2 gap-y-1">
              <span>Created {a.createdAt.toLocaleString()}</span>
              {a.wordCount ? <span>• {a.wordCount.toLocaleString()} words</span> : null}
              {a.estimatedCostUsd != null ? <span>• {formatUsd(a.estimatedCostUsd)} est.</span> : null}
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
        <CardContent className="space-y-3">
          {a.status === "FAILED" && (
            <p className="text-sm text-destructive">{a.errorMessage || "Generation failed"}</p>
          )}
          {a.status !== "FAILED" && a.status !== "COMPLETE" && (
            <p className="text-sm text-muted-foreground">This article is still processing.</p>
          )}
        </CardContent>
      </Card>

      {markdown ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Markdown value={markdown} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

