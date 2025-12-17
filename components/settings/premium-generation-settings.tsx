"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

type Prefs = {
  tone?: string
  include?: string
  exclude?: string
  additionalNotes?: string
  seoKeywords?: string
}

export function PremiumGenerationSettings() {
  const [prefs, setPrefs] = React.useState<Prefs>({})
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [saved, setSaved] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/user/premium-generation-prefs", { cache: "no-store" })
        const body = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(body?.error || "Failed to load preferences")
        if (!cancelled) setPrefs((body?.prefs as Prefs) || {})
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load preferences")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const onSave = async () => {
    setSaved(false)
    setError(null)
    setSaving(true)
    try {
      const res = await fetch("/api/user/premium-generation-prefs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(prefs),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error || "Failed to save preferences")
      setPrefs((body?.prefs as Prefs) || {})
      setSaved(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save preferences")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Loading…</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="tone">Tone</FieldLabel>
            <Textarea
              id="tone"
              value={prefs.tone || ""}
              onChange={(e) => setPrefs((p) => ({ ...p, tone: e.target.value }))}
              placeholder='Example: "Confident, practical, and friendly. Avoid hype."'
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="include">What to mention / add</FieldLabel>
            <Textarea
              id="include"
              value={prefs.include || ""}
              onChange={(e) => setPrefs((p) => ({ ...p, include: e.target.value }))}
              placeholder='Example: "Mention my tool ArticleMaster, add a short checklist at the end."'
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="exclude">What to exclude / avoid</FieldLabel>
            <Textarea
              id="exclude"
              value={prefs.exclude || ""}
              onChange={(e) => setPrefs((p) => ({ ...p, exclude: e.target.value }))}
              placeholder='Example: "Do not mention pricing, do not include jokes, avoid political references."'
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="seoKeywords">SEO keywords to focus on</FieldLabel>
            <Textarea
              id="seoKeywords"
              value={prefs.seoKeywords || ""}
              onChange={(e) => setPrefs((p) => ({ ...p, seoKeywords: e.target.value }))}
              placeholder='Example: "youtube to blog, ai article generator, seo long-form article"'
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="additionalNotes">Additional notes</FieldLabel>
            <Textarea
              id="additionalNotes"
              value={prefs.additionalNotes || ""}
              onChange={(e) => setPrefs((p) => ({ ...p, additionalNotes: e.target.value }))}
              placeholder='Anything else you want the generator to consider.'
            />
          </Field>
        </FieldGroup>

        <div className="flex items-center gap-3">
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
          {saved && <span className="text-sm text-muted-foreground">Saved.</span>}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  )
}

