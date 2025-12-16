import { AuthCard } from "@/components/auth/auth-card"
import { LoginForm } from "@/components/auth/login-form"
import { redirectIfAuthed } from "@/lib/auth/guards"

export default async function LoginPage() {
  await redirectIfAuthed("/dashboard")

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <AuthCard title="Sign in">
        <LoginForm />
      </AuthCard>
    </main>
  )
}
