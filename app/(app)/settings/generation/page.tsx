import Link from "next/link"

import { Button } from "@/components/ui/button"
import { requireUser } from "@/lib/auth/guards"
import { getEffectivePlan } from "@/lib/plans/plans"
import { PremiumGenerationSettings } from "@/components/settings/premium-generation-settings"

export default async function GenerationSettingsPage() {
  const user = await requireUser()
  const plan = getEffectivePlan({ planTier: user.planTier, planActiveUntil: user.planActiveUntil })

  if (plan !== "PREMIUM") {
    return (
      <div className="space-y-3">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Generation preferences</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Customizable generation preferences are available on the Premium plan.
          </p>
        </div>
        <Button asChild>
          <Link href="/settings/billing">Upgrade to Premium</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Generation preferences</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Set your preferred tone, what to include/exclude, and SEO keywords. These are added on top of the hardcoded system prompt.
        </p>
      </div>

      <PremiumGenerationSettings />
    </div>
  )
}

