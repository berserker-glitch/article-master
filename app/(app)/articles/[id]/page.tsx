import { notFound } from "next/navigation"

import { prisma } from "@/lib/db/prisma"
import { requireUser } from "@/lib/auth/guards"
import { ArticleDetail } from "@/components/articles/article-detail"
import { PublishPanel } from "@/components/articles/publish-panel"

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser()
  const { id } = await params

  const [article, wpConnections] = await Promise.all([
    prisma.article.findFirst({
      where: { id, userId: user.id },
      select: {
        id: true,
        status: true,
        sourceUrl: true,
        videoTitle: true,
        errorMessage: true,
        draftMarkdown: true,
        finalMarkdown: true,
        wordCount: true,
        estimatedCostUsd: true,
        createdAt: true,
      },
    }),
    prisma.wordPressConnection.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      select: { id: true, siteUrl: true, isDefault: true },
    }),
  ])

  if (!article) return notFound()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2">
        <ArticleDetail article={article} />
      </div>
      <div className="grid gap-6 lg:sticky lg:top-24">
        <PublishPanel
          articleId={article.id}
          canPublish={article.status === "COMPLETE"}
          connections={wpConnections}
        />
      </div>
    </div>
  )
}

