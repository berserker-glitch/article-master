"use client"

import * as React from "react"

import { IconCheck, IconTrash } from "@tabler/icons-react"

import { WordPressConnectForm } from "@/components/wordpress/wordpress-connect-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type Connection = {
  id: string
  siteUrl: string
  username: string
  isDefault: boolean
  createdAt: string
}

export function WordPressSettings(props: { initialConnections: Connection[] }) {
  const [connections, setConnections] = React.useState<Connection[]>(props.initialConnections)
  const [error, setError] = React.useState<string | null>(null)
  const [busyId, setBusyId] = React.useState<string | null>(null)

  const refresh = async () => {
    const res = await fetch("/api/wordpress/connection", { cache: "no-store" })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(body?.error || "Failed to load WordPress sites")
    setConnections(body.connections || [])
  }

  const onMakeDefault = async (connectionId: string) => {
    setBusyId(connectionId)
    setError(null)
    try {
      const res = await fetch("/api/wordpress/connection/default", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ connectionId }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error || "Failed to set default site")
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to set default site")
    } finally {
      setBusyId(null)
    }
  }

  const onDelete = async (connectionId: string) => {
    setBusyId(connectionId)
    setError(null)
    try {
      const res = await fetch(`/api/wordpress/connection/${connectionId}`, { method: "DELETE" })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error || "Failed to delete site")
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete site")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="grid gap-6">
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-base">Add a WordPress site</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <WordPressConnectForm
                onSaved={async () => {
                  await refresh()
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-base">Connected sites</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {connections.length === 0 ? (
                <p className="text-sm text-muted-foreground">No sites connected yet.</p>
              ) : (
                <div className="grid gap-4">
                  {connections.map((c, idx) => (
                    <div key={c.id} className="grid gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-medium truncate">{c.siteUrl}</div>
                          <div className="text-xs text-muted-foreground">Username: {c.username}</div>
                          <div className="text-xs text-muted-foreground">
                            Added {new Date(c.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {c.isDefault ? <Badge>Default</Badge> : <Badge variant="secondary">Site</Badge>}
                          <div className="flex items-center gap-2">
                            {!c.isDefault && (
                              <Button
                                size="sm"
                                variant="secondary"
                                disabled={busyId === c.id}
                                onClick={() => onMakeDefault(c.id)}
                              >
                                <IconCheck className="h-4 w-4 mr-2" />
                                Default
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={busyId === c.id}
                              onClick={() => onDelete(c.id)}
                            >
                              <IconTrash className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                      {idx < connections.length - 1 ? <Separator /> : null}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

