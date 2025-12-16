import { AppHeader } from "@/components/app/app-header"
import { requireUser } from "@/lib/auth/guards"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()

  return (
    <div className="min-h-screen bg-background">
      <AppHeader username={user.username} />
      <main className="px-6 py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  )
}
