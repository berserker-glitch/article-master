import { AuthCard } from "@/components/auth/auth-card"
import { CompleteSignupForm } from "@/components/auth/complete-signup-form"

type SearchParams = Record<string, string | string[] | undefined>

export default async function CompleteSignupPage({
  searchParams,
}: {
  // Next may pass searchParams as an object (typical) but some runtimes/types expose it as a Promise.
  searchParams: SearchParams | Promise<SearchParams>
}) {
  const sp = await Promise.resolve(searchParams)
  const raw = sp.token
  const token = Array.isArray(raw) ? raw[0] : raw

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <AuthCard title="Finish signup">
        {!token ? (
          <p className="text-sm text-muted-foreground">Missing or invalid signup link.</p>
        ) : (
          <CompleteSignupForm token={token} />
        )}
      </AuthCard>
    </main>
  )
}
