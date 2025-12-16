import { NextResponse } from "next/server"

import { createSignupToken } from "@/lib/auth/signup"
import { signupRequestSchema } from "@/lib/auth/validators"
import { sendEmail } from "@/lib/email/smtp"

export const runtime = "nodejs"

function appUrl(): string {
  return (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "")
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const parsed = signupRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const email = parsed.data.email.toLowerCase()
    const { token } = await createSignupToken(email)

    const link = `${appUrl()}/auth/complete?token=${encodeURIComponent(token)}`

    await sendEmail({
      to: email,
      subject: "Finish creating your ArticleMaster account",
      text: `Finish signup: ${link}`,
      html: `
        <div style="font-family: ui-sans-serif, system-ui; line-height: 1.5;">
          <h2>Finish your signup</h2>
          <p>Click the button below to set your username and password.</p>
          <p style="margin: 20px 0;">
            <a href="${link}" style="background:#0ea5e9;color:#000;text-decoration:none;padding:12px 16px;border-radius:10px;display:inline-block;">Complete signup</a>
          </p>
          <p>If the button doesn’t work, paste this link into your browser:</p>
          <p><a href="${link}">${link}</a></p>
        </div>
      `,
    })

    // Always return OK to avoid email enumeration.
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
