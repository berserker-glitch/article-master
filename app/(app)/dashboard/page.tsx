import { prisma } from "@/lib/db/prisma"
import { requireUser } from "@/lib/auth/guards"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default async function DashboardPage() {
  const user = await requireUser()
  const [recent, totals, sitesCount] = await Promise.all([
    prisma.article.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, status: true, videoTitle: true, createdAt: true, wordCount: true, estimatedCostUsd: true },
    }),
    prisma.article.aggregate({
      where: { userId: user.id },
      _count: { id: true },
      _sum: { wordCount: true, estimatedCostUsd: true },
    }),
    prisma.wordPressConnection.count({ where: { userId: user.id } }),
  ])

  return (
    <div className="min-h-[calc(100vh-64px)] w-full">
      <DashboardShell
        recentArticles={recent}
        totalArticles={totals._count.id}
        totalWords={totals._sum.wordCount || 0}
        totalCostUsd={totals._sum.estimatedCostUsd || 0}
        connectedSites={sitesCount}
      />
    </div>
  )
}
