import { prisma } from "@/lib/db/prisma"
import { requireUser } from "@/lib/auth/guards"
import { ArticleList } from "@/components/articles/article-list"

export default async function ArticlesPage() {
  const user = await requireUser()

  const items = await prisma.article.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, status: true, videoTitle: true, createdAt: true, wordCount: true, estimatedCostUsd: true },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Articles</h1>
          <p className="text-sm md:text-base text-muted-foreground">Your previous generations.</p>
        </div>
      </div>

      <ArticleList items={items} />
    </div>
  )
}

