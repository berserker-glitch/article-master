import { generateObject, generateText } from "ai"

import { prisma } from "@/lib/db/prisma"
import { getOpenRouter, modelFromEnv } from "@/lib/ai/openrouter"
import { chaptersSchema, critiqueSchema } from "@/lib/ai/schemas"
import { chaptersPrompt, critiquePrompt, expandPrompt, rewritePrompt, writerPrompt } from "@/lib/ai/prompts"
import { getEffectivePlan, type PremiumGenerationPrefs } from "@/lib/plans/plans"

const chaptersModelDefault = "google/gemini-2.0-flash-lite-001"
const writerModelDefault = "openai/gpt-5.2"
const criticModelDefault = "moonshotai/kimi-k2-thinking"

type NormalizedUsage = {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  costUsd: number | null
}

type UnknownRecord = Record<string, unknown>

function isRecord(v: unknown): v is UnknownRecord {
  return !!v && typeof v === "object"
}

function toNumber(v: unknown) {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0
  const n = typeof v === "string" ? Number(v) : Number(v)
  return Number.isFinite(n) ? n : 0
}

function normalizeUsage(result: unknown): NormalizedUsage {
  const usage = isRecord(result) && isRecord(result.usage) ? result.usage : null
  const promptTokens = toNumber(usage?.["promptTokens"] ?? usage?.["inputTokens"] ?? 0)
  const completionTokens = toNumber(usage?.["completionTokens"] ?? usage?.["outputTokens"] ?? 0)
  const totalTokens = toNumber(usage?.["totalTokens"] ?? usage?.["total"] ?? 0) || promptTokens + completionTokens

  // OpenRouter returns actual cost in the response
  const costUsdRaw = usage?.["cost"] ?? (isRecord(result) ? result["cost"] : 0)
  const costUsd = toNumber(costUsdRaw) || null

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
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: { user: { select: { planTier: true, planActiveUntil: true, premiumGenerationPrefs: true } } },
  })
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

    const plan = getEffectivePlan({
      planTier: article.user.planTier,
      planActiveUntil: article.user.planActiveUntil,
    })

    const prefs =
      plan === "PREMIUM" && article.user.premiumGenerationPrefs && typeof article.user.premiumGenerationPrefs === "object"
        ? (article.user.premiumGenerationPrefs as unknown as PremiumGenerationPrefs)
        : null

    const extraInstructions =
      prefs &&
      [
        prefs.tone ? `Tone: ${String(prefs.tone)}` : null,
        prefs.include ? `Mention/include: ${String(prefs.include)}` : null,
        prefs.exclude ? `Exclude/avoid: ${String(prefs.exclude)}` : null,
        prefs.additionalNotes ? `Additional notes: ${String(prefs.additionalNotes)}` : null,
      ]
        .filter(Boolean)
        .join("\n")

    const seoFocusKeywords = prefs?.seoKeywords ? String(prefs.seoKeywords) : null

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
        extraInstructions: extraInstructions || null,
        seoFocusKeywords,
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

    // Plan-based quality:
    // - FREE: basic generation (chapters + draft only)
    // - PRO: full pipeline (critique + rewrite + optional expand)
    // - PREMIUM: full pipeline + user prefs + stronger expansion threshold
    if (plan === "FREE") {
      const wordCount = countWords(draftMarkdown)
      await prisma.article.update({
        where: { id: articleId },
        data: {
          finalMarkdown: draftMarkdown,
          status: "COMPLETE",
          progress: 100,
          wordCount,
          promptTokens,
          completionTokens,
          totalTokens,
          estimatedCostUsd: Number.isFinite(estimatedCostUsd) ? estimatedCostUsd : null,
        },
      })
      return
    }

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
        extraInstructions: extraInstructions || null,
        seoFocusKeywords,
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
    const minWordsForExpand = plan === "PREMIUM" ? 1800 : 1500
    
    await prisma.article.update({
      where: { id: articleId },
      data: { progress: 90 },
    })
    
    if (wordCount < minWordsForExpand) {
      const expandRes = await generateText({
        model: writerModel,
        prompt: expandPrompt({
          articleMarkdown: finalMarkdown,
          transcript: article.transcript,
          extraInstructions: extraInstructions || null,
          seoFocusKeywords,
        }),
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

