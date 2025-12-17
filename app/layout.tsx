import type { Metadata } from "next";
import { Geist, Geist_Mono, Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ArticleAlchemist - SEO-Friendly AI Blog Generator | YouTube to Blog Converter",
    template: "%s | ArticleAlchemist",
  },
  description:
    "Transform YouTube videos into SEO-friendly, long-form blog articles with AI. Convert video transcripts to optimized blog posts with our AI transcriber and SEO blog AI tool. Perfect for content creators and bloggers.",
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
  authors: [{ name: "Scolink" }],
  creator: "Scolink",
  publisher: "Scolink",
  metadataBase: new URL(process.env.APP_URL || "https://articlealchemist.scolink.ink"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "ArticleAlchemist",
    title: "ArticleAlchemist - SEO-Friendly AI Blog Generator | YouTube to Blog Converter",
    description:
      "Transform YouTube videos into SEO-friendly, long-form blog articles with AI. Convert video transcripts to optimized blog posts with our AI transcriber and SEO blog AI tool.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArticleAlchemist - SEO-Friendly AI Blog Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArticleAlchemist - SEO-Friendly AI Blog Generator",
    description:
      "Transform YouTube videos into SEO-friendly, long-form blog articles with AI. Convert video transcripts to optimized blog posts.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${publicSans.variable} dark`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
