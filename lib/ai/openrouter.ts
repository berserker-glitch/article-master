import { createOpenAI } from "@ai-sdk/openai"

export function getOpenRouter() {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error("Missing env var: OPENROUTER_API_KEY")

  return createOpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    headers: {
      // OpenRouter recommends these for attribution.
      "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
      "X-Title": "ArticleMaster",
    },
  })
}

export function modelFromEnv(varName: string, fallback: string) {
  return process.env[varName] || fallback
}
