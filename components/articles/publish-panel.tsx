"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PublishButton } from "@/components/wordpress/publish-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as React from "react"

export type WordPressConnectionOption = {
  id: string
  siteUrl: string
  isDefault: boolean
}

export function PublishPanel(props: {
  articleId: string
  canPublish: boolean
  connections: WordPressConnectionOption[]
}) {
  const defaultId = props.connections.find((c) => c.isDefault)?.id || props.connections[0]?.id || null
  const [connectionId, setConnectionId] = React.useState<string | null>(defaultId)

  const selectedConnection = props.connections.find((c) => c.id === connectionId)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Publish</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Publish this article to your connected WordPress site.
        </p>

        {props.connections.length > 0 ? (
          <Select value={connectionId || ""} onValueChange={(v) => setConnectionId(v)}>
            <SelectTrigger>
              <SelectValue>
                {selectedConnection ? (
                  <span className="truncate">
                    {selectedConnection.siteUrl}{selectedConnection.isDefault ? " (default)" : ""}
                  </span>
                ) : (
                  "Select a WordPress site"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {props.connections.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <span className="truncate">{c.siteUrl}{c.isDefault ? " (default)" : ""}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-sm text-muted-foreground">No WordPress sites connected yet.</p>
        )}

        <PublishButton
          articleId={props.articleId}
          connectionId={connectionId}
          disabled={!props.canPublish || !connectionId}
        />
        {!props.canPublish && (
          <p className="text-sm text-muted-foreground">
            The article must be complete before publishing.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

