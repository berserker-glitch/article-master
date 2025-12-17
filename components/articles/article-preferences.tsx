"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

export function ArticlePreferences({
  articleId,
  initialPrefs,
  canEdit,
}: {
  articleId: string
  initialPrefs: GenerationPrefs | null
  canEdit: boolean
}) {
  const normalizePrefs = (p: GenerationPrefs | null): GenerationPrefs => {
    if (!p) return {}
    const result: GenerationPrefs = {}
    if (p.language) result.language = p.language
    if (p.tone) result.tone = p.tone
    if (p.include) result.include = p.include
    if (p.exclude) result.exclude = p.exclude
    if (p.additionalNotes) result.additionalNotes = p.additionalNotes
    if (p.seoKeywords) result.seoKeywords = p.seoKeywords
    return result
  }

  const [prefs, setPrefs] = React.useState<GenerationPrefs>(normalizePrefs(initialPrefs))
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [saved, setSaved] = React.useState(false)

  const hasPrefs = Object.values(prefs).some((v) => v && String(v).trim())

  const onSave = async () => {
    setSaved(false)
    setError(null)
    setSaving(true)
    try {
      const res = await fetch(`/api/articles/${articleId}/preferences`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(prefs),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error || "Failed to save preferences")
      setPrefs((body?.prefs as GenerationPrefs) || {})
      setSaved(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save preferences")
    } finally {
      setSaving(false)
    }
  }

  if (!hasPrefs && !canEdit) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>Generation Preferences</span>
          {hasPrefs && <Badge variant="secondary">Customized</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {canEdit ? (
          <>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="language">Language</FieldLabel>
                <Select
                  value={prefs.language || "en"}
                  onValueChange={(value) => {
                    setPrefs((p) => {
                      const updated: GenerationPrefs = {}
                      if (p.language) updated.language = p.language
                      if (p.tone) updated.tone = p.tone
                      if (p.include) updated.include = p.include
                      if (p.exclude) updated.exclude = p.exclude
                      if (p.additionalNotes) updated.additionalNotes = p.additionalNotes
                      if (p.seoKeywords) updated.seoKeywords = p.seoKeywords
                      if (value) updated.language = value
                      return updated
                    })
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

            <div className="flex items-center gap-3">
              <Button onClick={onSave} disabled={saving} size="sm">
                {saving ? "Saving…" : "Save preferences"}
              </Button>
              {saved && <span className="text-sm text-muted-foreground">Saved.</span>}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </>
        ) : (
          <div className="space-y-3 text-sm">
            {prefs.language && (
              <div>
                <div className="font-medium text-muted-foreground">Language:</div>
                <div className="text-foreground">
                  {LANGUAGES.find((l) => l.value === prefs.language)?.label || prefs.language}
                </div>
              </div>
            )}
            {prefs.tone && (
              <div>
                <div className="font-medium text-muted-foreground">Tone:</div>
                <div className="text-foreground">{prefs.tone}</div>
              </div>
            )}
            {prefs.include && (
              <div>
                <div className="font-medium text-muted-foreground">Include:</div>
                <div className="text-foreground">{prefs.include}</div>
              </div>
            )}
            {prefs.exclude && (
              <div>
                <div className="font-medium text-muted-foreground">Exclude:</div>
                <div className="text-foreground">{prefs.exclude}</div>
              </div>
            )}
            {prefs.seoKeywords && (
              <div>
                <div className="font-medium text-muted-foreground">SEO Keywords:</div>
                <div className="text-foreground">{prefs.seoKeywords}</div>
              </div>
            )}
            {prefs.additionalNotes && (
              <div>
                <div className="font-medium text-muted-foreground">Additional Notes:</div>
                <div className="text-foreground">{prefs.additionalNotes}</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}