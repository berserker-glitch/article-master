import { WordPressSettings } from "@/components/wordpress/wordpress-settings"
import { requireUser } from "@/lib/auth/guards"
import { prisma } from "@/lib/db/prisma"
import { getEffectivePlan, isWpAllowed } from "@/lib/plans/plans"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function WordPressSettingsPage() {
  const user = await requireUser()

  const plan = getEffectivePlan({ planTier: user.planTier, planActiveUntil: user.planActiveUntil })
  if (!isWpAllowed(plan)) {
    return (
      <div className="space-y-3">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">WordPress</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            WordPress integration is available on the Pro and Premium plans.
          </p>
        </div>
        <Button asChild>
          <Link href="/settings/billing">Upgrade</Link>
        </Button>
      </div>
    )
  }

  const connections = await prisma.wordPressConnection.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    select: { id: true, siteUrl: true, username: true, isDefault: true, createdAt: true },
  })

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">WordPress</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Connect one or more WordPress sites, choose a default, and publish completed articles.
        </p>
      </div>

      <WordPressSettings
        initialConnections={connections.map((c) => ({
          id: c.id,
          siteUrl: c.siteUrl,
          username: c.username,
          isDefault: c.isDefault,
          createdAt: c.createdAt.toISOString(),
        }))}
      />
    </div>
  )
}

