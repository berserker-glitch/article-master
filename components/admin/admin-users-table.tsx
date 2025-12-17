"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type UserRow = {
  id: string
  email: string
  username: string
  role: "USER" | "SUPERADMIN"
  planTier: "FREE" | "PRO" | "PREMIUM"
  planActiveUntil: string | null
  planChosenAt: string | null
  createdAt: string
}

export function AdminUsersTable({ initialUsers }: { initialUsers: UserRow[] }) {
  const [users, setUsers] = React.useState<UserRow[]>(initialUsers)
  const [savingId, setSavingId] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const updateLocal = (id: string, patch: Partial<UserRow>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)))
  }

  const save = async (u: UserRow, activeDays: number | null) => {
    setError(null)
    setSavingId(u.id)
    try {
      const res = await fetch(`/api/admin/users/${u.id}/plan`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ planTier: u.planTier, activeDays }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error || "Failed to update user")
      updateLocal(u.id, { planActiveUntil: body?.planActiveUntil ?? null, planTier: body?.planTier ?? u.planTier })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update user")
    } finally {
      setSavingId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All users</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b">
                <th className="py-2 pr-3 font-medium">Email</th>
                <th className="py-2 pr-3 font-medium">Username</th>
                <th className="py-2 pr-3 font-medium">Role</th>
                <th className="py-2 pr-3 font-medium">Plan</th>
                <th className="py-2 pr-3 font-medium">Active until</th>
                <th className="py-2 pr-3 font-medium">Days</th>
                <th className="py-2 pr-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <UserRowEditor
                  key={u.id}
                  user={u}
                  disabled={savingId === u.id}
                  onChange={(patch) => updateLocal(u.id, patch)}
                  onSave={(days) => save(u, days)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  )
}

function UserRowEditor({
  user,
  disabled,
  onChange,
  onSave,
}: {
  user: UserRow
  disabled: boolean
  onChange: (patch: Partial<UserRow>) => void
  onSave: (activeDays: number | null) => void
}) {
  const [days, setDays] = React.useState("30")
  const activeUntil = user.planActiveUntil ? new Date(user.planActiveUntil).toLocaleString() : "—"

  return (
    <tr className="border-b last:border-b-0">
      <td className="py-2 pr-3 align-top">{user.email}</td>
      <td className="py-2 pr-3 align-top">{user.username}</td>
      <td className="py-2 pr-3 align-top">{user.role}</td>
      <td className="py-2 pr-3 align-top min-w-40">
        <Select
          value={user.planTier}
          onValueChange={(v) => onChange({ planTier: v as UserRow["planTier"] })}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FREE">FREE</SelectItem>
            <SelectItem value="PRO">PRO</SelectItem>
            <SelectItem value="PREMIUM">PREMIUM</SelectItem>
          </SelectContent>
        </Select>
      </td>
      <td className="py-2 pr-3 align-top">{activeUntil}</td>
      <td className="py-2 pr-3 align-top w-24">
        <Input
          value={days}
          onChange={(e) => setDays(e.target.value)}
          disabled={disabled || user.planTier === "FREE"}
          inputMode="numeric"
        />
      </td>
      <td className="py-2 pr-3 align-top">
        <Button
          size="sm"
          onClick={() => onSave(user.planTier === "FREE" ? null : Math.max(1, Number(days) || 30))}
          disabled={disabled}
        >
          {disabled ? "Saving…" : "Save"}
        </Button>
      </td>
    </tr>
  )
}

