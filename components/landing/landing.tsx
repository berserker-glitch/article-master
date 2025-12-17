import { LandingHeader } from "@/components/landing/header"
import { LandingFeatureGrid } from "@/components/landing/feature-grid"
import { LandingFooter } from "@/components/landing/footer"
import { LandingHero } from "@/components/landing/hero"
import { LandingHowItWorks } from "@/components/landing/how-it-works"
import { LandingOutputPreview } from "@/components/landing/output-preview"
import { LandingPricing } from "@/components/landing/pricing"
import { LandingCTA } from "@/components/landing/cta"

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <LandingHero />
      <LandingFeatureGrid />
      <LandingHowItWorks />
      <LandingOutputPreview />
      <LandingPricing />
      <LandingCTA />
      <LandingFooter />
    </div>
  )
}
