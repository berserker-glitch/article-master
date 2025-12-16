import { z } from "zod"

export const chaptersSchema = z.object({
  title: z.string().min(3),
  sections: z
    .array(
      z.object({
        heading: z.string().min(3),
        summary: z.string().min(10),
        keyPoints: z.array(z.string().min(3)).min(1),
      })
    )
    .min(3),
})

export const critiqueSchema = z.object({
  strengths: z.array(z.string().min(3)).min(2),
  weaknesses: z.array(z.string().min(3)).min(2),
  fixes: z.array(z.string().min(3)).min(3),
})
