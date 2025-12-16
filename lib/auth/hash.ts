import crypto from "node:crypto"

function requireSecret(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env var: ${name}`)
  return value
}

export function sha256Base64Url(input: string): string {
  return crypto.createHash("sha256").update(input).digest("base64url")
}

// Hash tokens with a secret prefix so DB hashes are useless alone.
export function tokenHash(token: string): string {
  const secret = requireSecret("AUTH_COOKIE_SECRET")
  return sha256Base64Url(`${secret}:${token}`)
}

export function randomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("base64url")
}
