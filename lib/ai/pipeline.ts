import { generateObject, generateText } from "ai"

import { prisma } from "@/lib/db/prisma"
import { getOpenRouter, modelFromEnv } from "@/lib/ai/openrouter"
import { chaptersSchema, critiqueSchema } from "@/lib/ai/schemas"
import { chaptersPrompt, critiquePrompt, expandPrompt, rewritePrompt, writerPrompt } from "@/lib/ai/prompts"

const chaptersModelDefault = "google/gemini-2.0-flash-lite-001"
const writerModelDefault = "openai/gpt-5.2"
const criticModelDefault = "moonshotai/kimi-k2-thinking"

type NormalizedUsage = {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  costUsd: number | null
}

function normalizeUsage(result: unknown): NormalizedUsage {
  const usage = (result as any)?.usage
  const promptTokens = Number(usage?.promptTokens ?? usage?.inputTokens ?? 0) || 0
  const completionTokens = Number(usage?.completionTokens ?? usage?.outputTokens ?? 0) || 0
  const totalTokens =
    Number(usage?.totalTokens ?? usage?.total ?? 0) || promptTokens + completionTokens
  
  // OpenRouter returns actual cost in the response
  const costUsd = Number(usage?.cost ?? (result as any)?.cost ?? 0) || null
  
  return { promptTokens, completionTokens, totalTokens, costUsd }
}

function countWords(markdown: string) {
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, " ")
  const words = withoutCode
    .replace(/[^\S\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
  return words.length
}

const PRICING_USD_PER_MILLION_TOKENS: Record<string, { input: number; output: number }> = {
  // Best-effort estimates (prices can differ by provider/region).
  "openai/gpt-4o": { input: 5, output: 15 },
  "openai/gpt-4o-mini": { input: 0.15, output: 0.6 },
  "openai/gpt-5.2": { input: 10, output: 30 },
  "google/gemini-2.0-flash-lite-001": { input: 0.075, output: 0.3 },
  "moonshotai/kimi-k2-thinking": { input: 2, output: 8 },
}

function estimateCostUsd(args: { modelId: string; promptTokens: number; completionTokens: number }) {
  const pricing = PRICING_USD_PER_MILLION_TOKENS[args.modelId]
  if (!pricing) return null
  const input = (args.promptTokens / 1_000_000) * pricing.input
  const output = (args.completionTokens / 1_000_000) * pricing.output
  return input + output
}

export async function runArticlePipeline(articleId: string) {
  const article = await prisma.article.findUnique({ where: { id: articleId } })
  if (!article) return

  if (!article.transcript || !article.transcript.trim()) {
    await prisma.article.update({
      where: { id: articleId },
      data: { status: "FAILED", errorMessage: "Transcript is empty." },
    })
    return
  }

  try {
    const openrouter = getOpenRouter()
    let promptTokens = 0
    let completionTokens = 0
    let totalTokens = 0
    let estimatedCostUsd = 0

    // Progress tracking: 5 main steps (chapters=20%, draft=20%, critique=20%, rewrite=30%, expand=10%)
    await prisma.article.update({
      where: { id: articleId },
      data: { progress: 0 },
    })

    // Step 1: Chapters (structured)
    const chaptersModelId = modelFromEnv("OPENROUTER_MODEL_CHAPTERS", chaptersModelDefault)
    const chaptersModel = openrouter(chaptersModelId)
    const chaptersRes = await generateObject({
      model: chaptersModel,
      schema: chaptersSchema,
      prompt: chaptersPrompt({ videoTitle: article.videoTitle, transcript: article.transcript }),
    })
    const chapters = chaptersRes.object
    {
      const u = normalizeUsage(chaptersRes)
      promptTokens += u.promptTokens
      completionTokens += u.completionTokens
      totalTokens += u.totalTokens
      // Use actual cost from OpenRouter if available, otherwise estimate
      if (u.costUsd) {
        estimatedCostUsd += u.costUsd
      } else {
        const cost = estimateCostUsd({
          modelId: chaptersModelId,
          promptTokens: u.promptTokens,
          completionTokens: u.completionTokens,
        })
        if (cost) estimatedCostUsd += cost
      }
    }

    await prisma.article.update({
      where: { id: articleId },
      data: { chapters, progress: 20 },
    })

    // Step 2: Draft article (markdown)
    const writerModelId = modelFromEnv("OPENROUTER_MODEL_WRITER", writerModelDefault)
    const writerModel = openrouter(writerModelId)
    const draftRes = await generateText({
      model: writerModel,
      prompt: writerPrompt({
        videoTitle: article.videoTitle,
        chaptersJson: JSON.stringify(chapters, null, 2),
        transcript: article.transcript,
      }),
    })
    const draftMarkdown = draftRes.text
    {
      const u = normalizeUsage(draftRes)
      promptTokens += u.promptTokens
      completionTokens += u.completionTokens
      totalTokens += u.totalTokens
      if (u.costUsd) {
        estimatedCostUsd += u.costUsd
      } else {
        const cost = estimateCostUsd({
          modelId: writerModelId,
          promptTokens: u.promptTokens,
          completionTokens: u.completionTokens,
        })
        if (cost) estimatedCostUsd += cost
      }
    }

    await prisma.article.update({
      where: { id: articleId },
      data: { draftMarkdown, progress: 40 },
    })

    // Step 3: Critique (structured)
    const criticModelId = modelFromEnv("OPENROUTER_MODEL_CRITIC", criticModelDefault)
    const criticModel = openrouter(criticModelId)
    const critiqueRes = await generateObject({
      model: criticModel,
      schema: critiqueSchema,
      prompt: critiquePrompt({ draftMarkdown }),
    })
    const critique = critiqueRes.object
    {
      const u = normalizeUsage(critiqueRes)
      promptTokens += u.promptTokens
      completionTokens += u.completionTokens
      totalTokens += u.totalTokens
      if (u.costUsd) {
        estimatedCostUsd += u.costUsd
      } else {
        const cost = estimateCostUsd({
          modelId: criticModelId,
          promptTokens: u.promptTokens,
          completionTokens: u.completionTokens,
        })
        if (cost) estimatedCostUsd += cost
      }
    }

    await prisma.article.update({
      where: { id: articleId },
      data: { critique, progress: 60 },
    })

    // Step 4: Rewrite (markdown)
    // IMPORTANT: Feed the original draft + critique to rewrite the article.
    const rewriteRes = await generateText({
      model: writerModel,
      prompt: rewritePrompt({
        draftMarkdown,
        critiqueJson: JSON.stringify(critique, null, 2),
      }),
    })
    let finalMarkdown = rewriteRes.text
    {
      const u = normalizeUsage(rewriteRes)
      promptTokens += u.promptTokens
      completionTokens += u.completionTokens
      totalTokens += u.totalTokens
      if (u.costUsd) {
        estimatedCostUsd += u.costUsd
      } else {
        const cost = estimateCostUsd({
          modelId: writerModelId,
          promptTokens: u.promptTokens,
          completionTokens: u.completionTokens,
        })
        if (cost) estimatedCostUsd += cost
      }
    }

    // Step 5 (best-effort): Expand if too short
    let wordCount = countWords(finalMarkdown)
    
    await prisma.article.update({
      where: { id: articleId },
      data: { progress: 90 },
    })
    
    if (wordCount < 1500) {
      const expandRes = await generateText({
        model: writerModel,
        prompt: expandPrompt({ articleMarkdown: finalMarkdown, transcript: article.transcript }),
      })
      finalMarkdown = expandRes.text
      {
        const u = normalizeUsage(expandRes)
        promptTokens += u.promptTokens
        completionTokens += u.completionTokens
        totalTokens += u.totalTokens
        if (u.costUsd) {
          estimatedCostUsd += u.costUsd
        } else {
          const cost = estimateCostUsd({
            modelId: writerModelId,
            promptTokens: u.promptTokens,
            completionTokens: u.completionTokens,
          })
          if (cost) estimatedCostUsd += cost
        }
      }
      wordCount = countWords(finalMarkdown)
    }

    await prisma.article.update({
      where: { id: articleId },
      data: {
        finalMarkdown,
        status: "COMPLETE",
        progress: 100,
        wordCount,
        promptTokens,
        completionTokens,
        totalTokens,
        estimatedCostUsd: Number.isFinite(estimatedCostUsd) ? estimatedCostUsd : null,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    await prisma.article.update({
      where: { id: articleId },
      data: { status: "FAILED", errorMessage: message },
    })
  }
}

