import Link from "next/link"

import { IconArrowRight, IconClock, IconSparkles } from "@tabler/icons-react"

import { ArticleGenerator } from "@/components/dashboard/article-generator"
import { ArticleList, ArticleListItem } from "@/components/articles/article-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics"

export function DashboardShell(props: {
  recentArticles: ArticleListItem[]
  totalArticles: number
  totalWords: number
  totalCostUsd: number
  connectedSites: number
}) {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Generate long-form, SEO-focused articles (1500+ words) from a YouTube link—then publish to WordPress.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="secondary">
            <Link href="/articles">
              View all articles <IconArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <DashboardMetrics
        totalArticles={props.totalArticles}
        totalWords={props.totalWords}
        totalCostUsd={props.totalCostUsd}
        connectedSites={props.connectedSites}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <ArticleGenerator />
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-base flex items-center gap-2">
                <IconSparkles className="h-4 w-4" /> Tips for better SEO output
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground grid gap-2">
              <div>Use a video that’s already focused on one clear topic (avoid “random Q&A” videos).</div>
              <div>Prefer videos with strong structure (chapters/segments) for cleaner headings.</div>
              <div>After generation, publish only when status is <span className="text-foreground">COMPLETE</span>.</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle className="text-base flex items-center gap-2">
                <IconClock className="h-4 w-4" /> Recent articles
              </CardTitle>
              <Button asChild size="sm" variant="ghost">
                <Link href="/articles">All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <ArticleList items={props.recentArticles} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

