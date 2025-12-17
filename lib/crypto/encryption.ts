import crypto from "node:crypto"

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env var: ${name}`)
  return value
}

function getKey(): Buffer {
  const raw = requireEnv("APP_ENCRYPTION_KEY")
  const key = Buffer.from(raw, "base64")
  if (key.length !== 32) {
    throw new Error("APP_ENCRYPTION_KEY must be 32 bytes base64")
  }
  return key
}

export function encryptString(plaintext: string): string {
  const iv = crypto.randomBytes(12)
  const key = getKey()

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()

  return `${iv.toString("base64url")}.${ciphertext.toString("base64url")}.${tag.toString("base64url")}`
}

export function decryptString(payload: string): string {
  const [ivB64, ctB64, tagB64] = payload.split(".")
  if (!ivB64 || !ctB64 || !tagB64) throw new Error("Invalid encrypted payload")

  const iv = Buffer.from(ivB64, "base64url")
  const ciphertext = Buffer.from(ctB64, "base64url")
  const tag = Buffer.from(tagB64, "base64url")

  const key = getKey()
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
  decipher.setAuthTag(tag)

  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()])
  return plaintext.toString("utf8")
}


