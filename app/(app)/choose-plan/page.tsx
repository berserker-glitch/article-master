import { requireUser } from "@/lib/auth/guards"
import { getEffectivePlan } from "@/lib/plans/plans"
import { ChoosePlan } from "@/components/billing/choose-plan"

export default async function ChoosePlanPage() {
  const user = await requireUser()
  const plan = getEffectivePlan({ planTier: user.planTier, planActiveUntil: user.planActiveUntil })

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Choose your plan</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          You can start free and upgrade anytime. Pro and Premium subscriptions are processed by Paddle.
        </p>
      </div>

      <ChoosePlan currentPlan={plan} />
    </div>
  )
}

