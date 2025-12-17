import { AppHeader } from "@/components/app/app-header"
import { requireUser } from "@/lib/auth/guards"
import { getEffectivePlan } from "@/lib/plans/plans"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()
  const plan = getEffectivePlan({ planTier: user.planTier, planActiveUntil: user.planActiveUntil })

  return (
    <div className="min-h-screen bg-background">
      <AppHeader username={user.username} role={user.role} plan={plan} />
      <main className="px-6 py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  )
}
