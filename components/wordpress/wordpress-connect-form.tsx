"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function WordPressConnectForm(props: {
  initialSiteUrl?: string
  initialUsername?: string
  onSaved?: () => void | Promise<void>
}) {
  const [siteUrl, setSiteUrl] = React.useState(props.initialSiteUrl || "")
  const [username, setUsername] = React.useState(props.initialUsername || "")
  const [appPassword, setAppPassword] = React.useState("")
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [saved, setSaved] = React.useState(false)

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSaved(false)

    try {
      const res = await fetch("/api/wordpress/connection", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ siteUrl, username, appPassword }),
      })

      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error || "Could not save WordPress settings")

      setSaved(true)
      setAppPassword("")
      await props.onSaved?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save WordPress settings")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={onSave} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="siteUrl">WordPress site URL</FieldLabel>
          <Input
            id="siteUrl"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="username">WordPress username</FieldLabel>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="appPassword">Application password</FieldLabel>
          <Input
            id="appPassword"
            type="password"
            value={appPassword}
            onChange={(e) => setAppPassword(e.target.value)}
            placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
            required
          />
        </Field>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </FieldGroup>

      {saved && <p className="text-sm text-muted-foreground">Saved.</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <p className="text-sm text-muted-foreground">
        Use a WordPress <span className="font-medium">Application Password</span> for secure API access.
      </p>
    </form>
  )
}

