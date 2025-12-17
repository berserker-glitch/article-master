"use client"

import * as React from "react"

import { IconChevronDown, IconChevronUp, IconSparkles } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArticleStatus } from "@/components/dashboard/article-status"
import { GenerationProgressModal } from "@/components/dashboard/generation-progress-modal"

type GenerationPrefs = {
  language?: string
  tone?: string
  include?: string
  exclude?: string
  additionalNotes?: string
  seoKeywords?: string
}

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "nl", label: "Dutch" },
  { value: "ru", label: "Russian" },
  { value: "ja", label: "Japanese" },
  { value: "zh", label: "Chinese" },
  { value: "ko", label: "Korean" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
  { value: "tr", label: "Turkish" },
  { value: "pl", label: "Polish" },
  { value: "sv", label: "Swedish" },
  { value: "da", label: "Danish" },
  { value: "no", label: "Norwegian" },
  { value: "fi", label: "Finnish" },
  { value: "cs", label: "Czech" },
]

export function ArticleGenerator() {
  const [youtubeUrl, setYoutubeUrl] = React.useState("")
  const [isRunning, setIsRunning] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [articleId, setArticleId] = React.useState<string | null>(null)
  const [showProgress, setShowProgress] = React.useState(false)
  const [showPrefs, setShowPrefs] = React.useState(false)
  const [prefs, setPrefs] = React.useState<GenerationPrefs>({})

  const onGenerate = async () => {
    setIsRunning(true)
    setError(null)
    setArticleId(null)

    try {
      const res = await fetch("/api/articles/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          youtubeUrl,
          generationPrefs: Object.keys(prefs).length > 0 ? prefs : undefined,
        }),
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
    // Reset form after successful generation
    setYoutubeUrl("")
    setPrefs({})
    setShowPrefs(false)
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
            Paste a YouTube URL. We&apos;ll generate a structured, SEO-first article with <span className="text-foreground">1500+ words</span>{" "}
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

            <div className="space-y-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPrefs(!showPrefs)}
                className="w-full justify-between"
              >
                <span>Customize generation preferences (optional)</span>
                {showPrefs ? <IconChevronUp className="h-4 w-4" /> : <IconChevronDown className="h-4 w-4" />}
              </Button>

              {showPrefs && (
                <Card className="border-dashed">
                  <CardContent className="pt-4 space-y-4">
                    <div className="text-xs text-muted-foreground">
                      Customize how this specific article is generated. These settings apply only to this article.
                    </div>
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="language">Language</FieldLabel>
                        <Select
                          value={prefs.language || "en"}
                          onValueChange={(value) => {
                            setPrefs((p) => ({ ...p, language: value as string }))
                          }}
                        >
                        <SelectTrigger id="language" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((lang) => (
                              <SelectItem key={lang.value} value={lang.value}>
                                {lang.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="tone">Tone</FieldLabel>
                        <Textarea
                          id="tone"
                          value={prefs.tone || ""}
                          onChange={(e) => setPrefs((p) => ({ ...p, tone: e.target.value }))}
                          placeholder='Example: "Confident, practical, and friendly. Avoid hype."'
                          rows={2}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="include">What to mention / add</FieldLabel>
                        <Textarea
                          id="include"
                          value={prefs.include || ""}
                          onChange={(e) => setPrefs((p) => ({ ...p, include: e.target.value }))}
                          placeholder='Example: "Mention my tool ArticleAlchemist, add a short checklist at the end."'
                          rows={2}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="exclude">What to exclude / avoid</FieldLabel>
                        <Textarea
                          id="exclude"
                          value={prefs.exclude || ""}
                          onChange={(e) => setPrefs((p) => ({ ...p, exclude: e.target.value }))}
                          placeholder='Example: "Do not mention pricing, do not include jokes, avoid political references."'
                          rows={2}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="seoKeywords">SEO keywords to focus on</FieldLabel>
                        <Textarea
                          id="seoKeywords"
                          value={prefs.seoKeywords || ""}
                          onChange={(e) => setPrefs((p) => ({ ...p, seoKeywords: e.target.value }))}
                          placeholder='Example: "youtube to blog, ai article generator, seo long-form article"'
                          rows={2}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="additionalNotes">Additional notes</FieldLabel>
                        <Textarea
                          id="additionalNotes"
                          value={prefs.additionalNotes || ""}
                          onChange={(e) => setPrefs((p) => ({ ...p, additionalNotes: e.target.value }))}
                          placeholder="Anything else you want the generator to consider for this article."
                          rows={2}
                        />
                      </Field>
                    </FieldGroup>
                  </CardContent>
                </Card>
              )}
            </div>

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