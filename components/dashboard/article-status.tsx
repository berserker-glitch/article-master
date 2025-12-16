"use client"

import * as React from "react"

import { IconCoins, IconFileText } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Markdown } from "@/components/articles/markdown"

type Article = {
  id: string
  status: "PENDING" | "RUNNING" | "COMPLETE" | "FAILED"
  videoTitle?: string | null
  errorMessage?: string | null
  finalMarkdown?: string | null
  wordCount?: number | null
  estimatedCostUsd?: number | null
}

function formatUsd(value: number) {
  if (!Number.isFinite(value)) return "$0.00"
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 4 }).format(value)
}

export function ArticleStatus(props: { articleId: string }) {
  const [article, setArticle] = React.useState<Article | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let alive = true
    let timer: number | undefined

    const tick = async () => {
      try {
        const res = await fetch(`/api/articles/${props.articleId}`, { cache: "no-store" })
        const body = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(body?.error || "Failed to load article")
        if (!alive) return

        setArticle(body.article)
        setError(null)

        const status = body.article?.status
        if (status === "RUNNING" || status === "PENDING") {
          timer = window.setTimeout(tick, 2000)
        }
      } catch (e) {
        if (!alive) return
        setError(e instanceof Error ? e.message : "Failed to load article")
        timer = window.setTimeout(tick, 2500)
      }
    }

    tick()

    return () => {
      alive = false
      if (timer) window.clearTimeout(timer)
    }
  }, [props.articleId])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-base">Generation status</CardTitle>
        <Badge variant={article?.status === "COMPLETE" ? "default" : article?.status === "FAILED" ? "destructive" : "secondary"}>
          {article?.status || "..."}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}

        {article?.status === "COMPLETE" && (article.wordCount || article.estimatedCostUsd != null) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-muted/20 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <IconFileText className="h-4 w-4" /> Words
              </div>
              <div className="text-lg font-semibold">{article.wordCount?.toLocaleString() || "—"}</div>
            </div>
            <div className="rounded-lg border bg-muted/20 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <IconCoins className="h-4 w-4" /> Est. cost
              </div>
              <div className="text-lg font-semibold">
                {article.estimatedCostUsd == null ? "—" : formatUsd(article.estimatedCostUsd)}
              </div>
            </div>
          </div>
        )}

        {article?.status === "FAILED" && (
          <p className="text-sm text-destructive">{article.errorMessage || "Generation failed"}</p>
        )}

        {article?.status !== "COMPLETE" && article?.status !== "FAILED" && (
          <p className="text-sm text-muted-foreground">Working… this will update automatically.</p>
        )}

        {article?.status === "COMPLETE" && article.finalMarkdown && (
          <>
            {(article.wordCount || article.estimatedCostUsd) && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground pb-3 border-b">
                {article.wordCount && <span>{article.wordCount.toLocaleString()} words</span>}
                {article.estimatedCostUsd && <span>~${article.estimatedCostUsd.toFixed(4)}</span>}
              </div>
            )}
            <Markdown value={article.finalMarkdown} />
          </>
        )}
      </CardContent>
    </Card>
  )
}

