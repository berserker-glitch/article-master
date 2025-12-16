"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"

export function PublishButton(props: { articleId: string; connectionId?: string | null; disabled?: boolean }) {
  const [isPublishing, setIsPublishing] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [resultUrl, setResultUrl] = React.useState<string | null>(null)

  const onPublish = async () => {
    setIsPublishing(true)
    setError(null)
    setResultUrl(null)

    try {
      const res = await fetch(`/api/articles/${props.articleId}/publish`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ connectionId: props.connectionId || null }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error || "Publish failed")
      setResultUrl(body.url || null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Publish failed")
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button type="button" onClick={onPublish} disabled={props.disabled || isPublishing || !props.connectionId}>
        {isPublishing ? "Publishing..." : "Publish to WordPress"}
      </Button>
      {resultUrl && (
        <div className="text-sm text-muted-foreground">
          Published: <a className="underline" href={resultUrl} target="_blank" rel="noreferrer">{resultUrl}</a>
        </div>
      )}
      {error && <div className="text-sm text-destructive">{error}</div>}
    </div>
  )
}

