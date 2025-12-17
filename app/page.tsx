import { LandingPage } from "@/components/landing/landing"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SEO-Friendly AI Blog Generator | YouTube to Blog Converter - ArticleAlchemist",
  description:
    "Transform YouTube videos into SEO-friendly, long-form blog articles with AI. Our AI transcriber converts video transcripts to optimized blog posts. Perfect for content creators looking for an SEO blog AI solution.",
  keywords: [
    "seo friendly",
    "youtube to blog",
    "ai transcriber",
    "seo blog ai",
    "youtube transcript to blog",
    "ai blog generator",
    "seo article generator",
    "video to blog converter",
    "ai content writer",
    "blog generator from video",
    "seo optimized blog",
    "ai article writer",
    "youtube to article",
    "transcript to blog",
    "ai blog writer",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ArticleAlchemist - SEO-Friendly AI Blog Generator | YouTube to Blog Converter",
    description:
      "Transform YouTube videos into SEO-friendly, long-form blog articles with AI. Convert video transcripts to optimized blog posts with our AI transcriber and SEO blog AI tool.",
    url: "/",
  },
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "ArticleAlchemist",
            applicationCategory: "WebApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "127",
            },
            description:
              "SEO-friendly AI blog generator that converts YouTube videos to optimized blog articles. Transform video transcripts into long-form, SEO-optimized content with our AI transcriber and SEO blog AI tool.",
            featureList: [
              "YouTube to blog conversion",
              "AI transcriber for video transcripts",
              "SEO-friendly article generation",
              "Long-form blog content (1500+ words)",
              "WordPress publishing integration",
              "SEO blog AI optimization",
            ],
            keywords: "seo friendly, youtube to blog, ai transcriber, seo blog ai, ai blog generator",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Scolink",
            url: "https://articlealchemist.scolink.ink",
            logo: "https://articlealchemist.scolink.ink/logo.png",
            sameAs: [],
          }),
        }}
      />
      <LandingPage />
    </>
  )
}