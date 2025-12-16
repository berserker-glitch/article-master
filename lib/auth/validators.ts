import { z } from "zod"

export const emailSchema = z.string().trim().email()

export const signupRequestSchema = z.object({
  email: emailSchema,
})

export const loginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(200),
})

export const completeSignupSchema = z
  .object({
    token: z.string().min(10),
    username: z
      .string()
      .trim()
      .min(3)
      .max(32)
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: z.string().min(8).max(200),
    passwordConfirm: z.string().min(8).max(200),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  })
