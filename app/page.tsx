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
    "youtube video to blog post",
    "ai transcription tool",
    "content creation ai",
    "blog writing software",
    "video content to text",
    "seo content generator",
    "automated blogging",
    "ai powered blogging",
    "video transcription ai",
    "blog post generator",
    "content marketing ai",
    "seo friendly articles",
    "youtube content repurposing",
    "ai writing assistant",
    "blog automation tool",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ArticleAlchemist - SEO-Friendly AI Blog Generator | YouTube to Blog Converter",
    description:
      "Transform YouTube videos into SEO-friendly, long-form blog articles with AI. Convert video transcripts to optimized blog posts with our AI transcriber and SEO blog AI tool.",
    url: "/",
    type: "website",
    siteName: "ArticleAlchemist",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArticleAlchemist - AI Blog Generator from YouTube Videos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArticleAlchemist - SEO-Friendly AI Blog Generator",
    description:
      "Transform YouTube videos into SEO-friendly blog articles with AI. Convert transcripts to optimized content.",
    images: ["/og-image.png"],
  },
}

export default function Page() {
  return (
    <>
      {/* Breadcrumb Navigation Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://articlealchemist.scolink.ink"
              }
            ]
          }),
        }}
      />

      {/* WebSite Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "ArticleAlchemist",
            "alternateName": "AI Blog Generator",
            "url": "https://articlealchemist.scolink.ink",
            "description": "SEO-friendly AI blog generator that converts YouTube videos to optimized blog articles",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://articlealchemist.scolink.ink/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "inLanguage": "en-US"
          }),
        }}
      />

      {/* Software Application Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "ArticleAlchemist",
            "applicationCategory": "WebApplication",
            "operatingSystem": "Web",
            "url": "https://articlealchemist.scolink.ink",
            "downloadUrl": "https://articlealchemist.scolink.ink",
            "offers": [
              {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free plan - 1 article per week"
              },
              {
                "@type": "Offer",
                "price": "8",
                "priceCurrency": "USD",
                "description": "Pro plan - 4 articles per week"
              },
              {
                "@type": "Offer",
                "price": "12",
                "priceCurrency": "USD",
                "description": "Premium plan - 1 article per day"
              }
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "127",
              "bestRating": "5",
              "worstRating": "1"
            },
            "description":
              "SEO-friendly AI blog generator that converts YouTube videos to optimized blog articles. Transform video transcripts into long-form, SEO-optimized content with our AI transcriber and SEO blog AI tool.",
            "featureList": [
              "YouTube to blog conversion",
              "AI transcriber for video transcripts",
              "SEO-friendly article generation",
              "Long-form blog content (1500+ words)",
              "WordPress publishing integration",
              "SEO blog AI optimization",
              "Customizable generation preferences",
              "Cost tracking and usage monitoring",
              "Multi-step AI writing pipeline",
              "Keyword optimization",
              "FAQ and table of contents generation"
            ],
            "keywords": "seo friendly, youtube to blog, ai transcriber, seo blog ai, ai blog generator, seo article generator, video to blog converter",
            "screenshot": "https://articlealchemist.scolink.ink/preview.png",
            "softwareVersion": "1.0.0",
            "author": {
              "@type": "Organization",
              "name": "Scolink"
            }
          }),
        }}
      />

      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "YouTube to Blog Conversion",
            "description": "AI-powered service that converts YouTube video transcripts into SEO-friendly blog articles",
            "provider": {
              "@type": "Organization",
              "name": "Scolink",
              "url": "https://articlealchemist.scolink.ink"
            },
            "serviceType": "Content Generation",
            "areaServed": "Worldwide",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "ArticleAlchemist Plans",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Free Plan",
                    "description": "1 article per week, basic YouTube to blog conversion"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Pro Plan",
                    "description": "4 articles per week, advanced SEO blog AI features"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Premium Plan",
                    "description": "1 article per day, customizable AI transcriber with premium features"
                  }
                }
              ]
            }
          }),
        }}
      />

      {/* HowTo Schema for the process */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Convert YouTube Videos to Blog Articles",
            "description": "Step-by-step guide to transform YouTube videos into SEO-friendly blog posts using AI",
            "image": "https://articlealchemist.scolink.ink/how-to-guide.png",
            "totalTime": "PT10M",
            "supply": [
              {
                "@type": "HowToSupply",
                "name": "YouTube Video URL"
              }
            ],
            "tool": [
              {
                "@type": "HowToTool",
                "name": "ArticleAlchemist AI Blog Generator"
              }
            ],
            "step": [
              {
                "@type": "HowToStep",
                "name": "Paste YouTube URL",
                "text": "Copy and paste your YouTube video URL into ArticleAlchemist",
                "position": 1,
                "image": "https://articlealchemist.scolink.ink/step1.png"
              },
              {
                "@type": "HowToStep",
                "name": "AI Transcription",
                "text": "Our AI transcriber extracts and processes the video transcript automatically",
                "position": 2,
                "image": "https://articlealchemist.scolink.ink/step2.png"
              },
              {
                "@type": "HowToStep",
                "name": "SEO Content Generation",
                "text": "The SEO blog AI generates structured, keyword-optimized blog content",
                "position": 3,
                "image": "https://articlealchemist.scolink.ink/step3.png"
              },
              {
                "@type": "HowToStep",
                "name": "WordPress Publishing",
                "text": "Publish your SEO-friendly article directly to WordPress",
                "position": 4,
                "image": "https://articlealchemist.scolink.ink/step4.png"
              }
            ]
          }),
        }}
      />

      {/* Video Schema for YouTube integration */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": "ArticleAlchemist Demo - YouTube to Blog Conversion",
            "description": "See how our AI transcriber converts YouTube videos into SEO-friendly blog articles",
            "thumbnailUrl": "https://articlealchemist.scolink.ink/video-thumbnail.jpg",
            "uploadDate": "2025-12-17",
            "duration": "PT2M30S",
            "contentUrl": "https://articlealchemist.scolink.ink/demo-video.mp4",
            "embedUrl": "https://articlealchemist.scolink.ink/demo-video",
            "interactionStatistic": {
              "@type": "InteractionCounter",
              "interactionType": "https://schema.org/WatchAction",
              "userInteractionCount": 1250
            },
            "author": {
              "@type": "Organization",
              "name": "Scolink"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Scolink"
            }
          }),
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is an AI transcriber?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "An AI transcriber is a tool that uses artificial intelligence to convert spoken audio from videos into written text. Our AI transcriber extracts YouTube video transcripts and transforms them into structured, SEO-friendly blog articles."
                }
              },
              {
                "@type": "Question",
                "name": "How does YouTube to blog conversion work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "YouTube to blog conversion involves extracting the video transcript, processing it with AI, and generating a complete blog article with proper SEO structure, headings, and keyword optimization. Our tool handles this entire process automatically."
                }
              },
              {
                "@type": "Question",
                "name": "What is SEO blog AI?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "SEO blog AI refers to artificial intelligence tools specifically designed to create search engine optimized blog content. Our SEO blog AI analyzes content structure, adds relevant keywords, creates compelling meta descriptions, and ensures articles are optimized for search engines."
                }
              },
              {
                "@type": "Question",
                "name": "Can I publish generated articles to WordPress?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! ArticleAlchemist includes WordPress publishing integration. You can connect your WordPress site and publish SEO-friendly articles directly from our platform. This feature is available in our Pro and Premium plans."
                }
              },
              {
                "@type": "Question",
                "name": "How many articles can I generate?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Free plan: 1 article per week, Pro plan: 4 articles per week, Premium plan: 1 article per day. All plans include our AI transcriber and SEO blog AI features."
                }
              },
              {
                "@type": "Question",
                "name": "What makes articles SEO-friendly?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "SEO-friendly articles include proper heading structure (H1, H2, H3), keyword optimization, meta descriptions, FAQ sections, internal linking suggestions, and content that matches search intent. Our AI ensures each article is optimized for search engines."
                }
              }
            ]
          }),
        }}
      />

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Scolink",
            "url": "https://articlealchemist.scolink.ink",
            "logo": "https://articlealchemist.scolink.ink/logo.png",
            "description": "Leading provider of AI-powered content generation tools, specializing in YouTube to blog conversion and SEO-friendly article creation.",
            "foundingDate": "2025",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Support",
              "availableLanguage": "English"
            },
            "sameAs": [
              "https://twitter.com/articlealchemist",
              "https://linkedin.com/company/scolink"
            ],
            "knowsAbout": [
              "AI Content Generation",
              "SEO Optimization",
              "YouTube Video Transcription",
              "Blog Writing Automation",
              "WordPress Integration",
              "Content Marketing",
              "Digital Publishing"
            ]
          }),
        }}
      />

      <LandingPage />
    </>
  )
}