"use client"

import * as React from "react"

import { IconSparkles } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ArticleStatus } from "@/components/dashboard/article-status"
import { GenerationProgressModal } from "@/components/dashboard/generation-progress-modal"

export function ArticleGenerator() {
  const [youtubeUrl, setYoutubeUrl] = React.useState("")
  const [isRunning, setIsRunning] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [articleId, setArticleId] = React.useState<string | null>(null)
  const [showProgress, setShowProgress] = React.useState(false)

  const onGenerate = async () => {
    setIsRunning(true)
    setError(null)
    setArticleId(null)

    try {
      const res = await fetch("/api/articles/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ youtubeUrl }),
      })

      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(body?.error || "Generation failed")
      }

      setArticleId(body.articleId)
      setShowProgress(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed")
      setIsRunning(false)
    }
  }

  const onGenerationComplete = () => {
    setShowProgress(false)
    setIsRunning(false)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 items-start">
      <Card className="w-full overflow-hidden lg:col-span-1">
        <CardHeader className="border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2">
            <IconSparkles className="h-4 w-4" />
            Generate a long-form SEO article
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <div className="text-sm text-muted-foreground">
            Paste a YouTube URL. We’ll generate a structured, SEO-first article with <span className="text-foreground">1500+ words</span>{" "}
            and an estimated cost.
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="youtubeUrl">YouTube URL</FieldLabel>
              <Input
                id="youtubeUrl"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </Field>
            <Button type="button" onClick={onGenerate} disabled={isRunning || !youtubeUrl.trim()}>
              {isRunning ? "Starting…" : "Generate"}
            </Button>
          </FieldGroup>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      <div className="lg:col-span-1">
        {articleId && !showProgress ? (
          <ArticleStatus articleId={articleId} />
        ) : (
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-base">Generation status</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Start a generation to see live progress, word count, and estimated cost here.
            </CardContent>
          </Card>
        )}
      </div>

      {showProgress && articleId && (
        <GenerationProgressModal articleId={articleId} onComplete={onGenerationComplete} />
      )}
    </div>
  )
}
