import { redirect } from "next/navigation"

import { prisma } from "@/lib/db/prisma"
import { requireUser } from "@/lib/auth/guards"
import { AdminUsersTable } from "@/components/admin/admin-users-table"

export default async function AdminUsersPage() {
  const user = await requireUser()
  if (user.role !== "SUPERADMIN") redirect("/dashboard")

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      planTier: true,
      planActiveUntil: true,
      planChosenAt: true,
      createdAt: true,
    },
  })

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          View users and change their plan status.
        </p>
      </div>

      <AdminUsersTable
        initialUsers={users.map((u) => ({
          ...u,
          createdAt: u.createdAt.toISOString(),
          planActiveUntil: u.planActiveUntil ? u.planActiveUntil.toISOString() : null,
          planChosenAt: u.planChosenAt ? u.planChosenAt.toISOString() : null,
        }))}
      />
    </div>
  )
}

