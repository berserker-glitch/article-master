import { getSessionUser } from "@/lib/auth/session"

export async function requireApiUser() {
  const user = await getSessionUser()
  if (!user) {
    return {
      user: null,
      errorResponse: new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      }),
    } as const
  }
  return { user, errorResponse: null } as const
}
