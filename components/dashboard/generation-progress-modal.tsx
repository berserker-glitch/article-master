"use client"

import * as React from "react"
import { IconLoader2, IconSparkles } from "@tabler/icons-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Article = {
  id: string
  status: "PENDING" | "RUNNING" | "COMPLETE" | "FAILED"
  videoTitle?: string | null
  progress?: number | null
}

function getProgressLabel(progress: number) {
  if (progress === 0) return "Starting generation..."
  if (progress <= 20) return "Organizing content into chapters..."
  if (progress <= 40) return "Writing initial draft..."
  if (progress <= 60) return "Analyzing article quality..."
  if (progress <= 90) return "Refining and optimizing..."
  return "Finalizing article..."
}

export function GenerationProgressModal(props: { articleId: string; onComplete: () => void }) {
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
        if (status === "COMPLETE" || status === "FAILED") {
          props.onComplete()
          return
        }

        if (status === "RUNNING" || status === "PENDING") {
          timer = window.setTimeout(tick, 1500)
        }
      } catch (e) {
        if (!alive) return
        setError(e instanceof Error ? e.message : "Failed to load progress")
        timer = window.setTimeout(tick, 2500)
      }
    }

    tick()

    return () => {
      alive = false
      if (timer) window.clearTimeout(timer)
    }
  }, [props.articleId, props.onComplete])

  const progress = article?.progress ?? 0
  const isActive = article?.status === "RUNNING" || article?.status === "PENDING"

  if (!isActive) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg flex items-center gap-2">
            <IconSparkles className="h-5 w-5 text-primary animate-pulse" />
            Generating Article
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {article?.videoTitle || "Processing your request..."}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{getProgressLabel(progress)}</span>
              <span className="font-medium tabular-nums">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconLoader2 className="h-4 w-4 animate-spin" />
            <span>Please wait, this may take a few minutes...</span>
          </div>

          <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
            <strong className="text-foreground">Note:</strong> Generation continues server-side. You can reload the page if needed.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
