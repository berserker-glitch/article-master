import { AuthCard } from "@/components/auth/auth-card"
import { SignupForm } from "@/components/auth/signup-form"
import { redirectIfAuthed } from "@/lib/auth/guards"

export default async function SignupPage() {
  await redirectIfAuthed("/dashboard")

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <AuthCard title="Create your account">
        <SignupForm />
      </AuthCard>
    </main>
  )
}
