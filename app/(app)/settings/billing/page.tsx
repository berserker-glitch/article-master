import { requireUser } from "@/lib/auth/guards"
import { getEffectivePlan, getUsageStatus } from "@/lib/plans/plans"
import { BillingPlans } from "@/components/billing/billing-plans"

export default async function BillingPage() {
  const user = await requireUser()
  const plan = getEffectivePlan({ planTier: user.planTier, planActiveUntil: user.planActiveUntil })
  const usage = await getUsageStatus(user.id)

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Plans</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Choose the plan that fits your usage. Your current plan is <span className="text-foreground font-medium">{plan}</span>.
        </p>
        {usage.ok && (
          <p className="text-sm text-muted-foreground">
            Usage: <span className="text-foreground font-medium">{usage.used}</span> / {usage.max} in the current{" "}
            {usage.window === "rolling_24h" ? "24h" : "7d"} window.
          </p>
        )}
      </div>

      <BillingPlans currentPlan={plan} />
    </div>
  )
}

