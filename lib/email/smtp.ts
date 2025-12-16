import nodemailer from "nodemailer"

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env var: ${name}`)
  return value
}

export function getSmtpTransport() {
  const host = requireEnv("SMTP_HOST")
  const port = Number(requireEnv("SMTP_PORT"))
  const user = requireEnv("SMTP_USER")
  const pass = requireEnv("SMTP_PASS")

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

export async function sendEmail(args: { to: string; subject: string; html: string; text?: string }) {
  const from = requireEnv("SMTP_FROM")
  const transport = getSmtpTransport()

  await transport.sendMail({
    from,
    to: args.to,
    subject: args.subject,
    html: args.html,
    text: args.text,
  })
}
