import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || "https://articlealchemist.scolink.ink"
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/dashboard/", "/articles/", "/settings/", "/choose-plan/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
