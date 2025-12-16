import { cookies } from "next/headers"
import { AUTH_SESSION_COOKIE_NAME, AUTH_SESSION_TTL_SECONDS } from "@/lib/auth/constants"

export async function setSessionCookie(token: string) {
  const isProd = process.env.NODE_ENV === "production"
  const store = await cookies()
  store.set(AUTH_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: AUTH_SESSION_TTL_SECONDS,
  })
}

export async function clearSessionCookie() {
  const store = await cookies()
  store.set(AUTH_SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
}

export async function readSessionCookie(): Promise<string | null> {
  const store = await cookies()
  return store.get(AUTH_SESSION_COOKIE_NAME)?.value ?? null
}
