/*
  Create or promote a SUPERADMIN user.

  Usage:
    bun scripts/create-superadmin.js --email "you@domain.com" --username "admin" --password "strong-password"

  Notes:
  - If a user with the email already exists, it will be promoted to SUPERADMIN.
  - If it doesn't exist, it will be created with the provided username/password.
*/

/* eslint-disable @typescript-eslint/no-require-imports */

const bcrypt = require("bcryptjs")
const { PrismaClient } = require("../lib/generated/prisma")

function readArg(name) {
  const idx = process.argv.indexOf(name)
  if (idx < 0) return null
  const v = process.argv[idx + 1]
  if (!v || v.startsWith("--")) return null
  return v
}

function hasFlag(name) {
  return process.argv.includes(name)
}

function usage() {
  console.log(
    [
      "Create or promote a SUPERADMIN user.",
      "",
      "Usage:",
      '  bun scripts/create-superadmin.js --email "you@domain.com" --username "admin" --password "strong-password"',
      "",
      "Optional env vars (as defaults):",
      "  SUPERADMIN_EMAIL, SUPERADMIN_USERNAME, SUPERADMIN_PASSWORD",
      "",
      "Options:",
      "  --help   Show this help",
      "",
    ].join("\n")
  )
}

async function main() {
  if (hasFlag("--help") || hasFlag("-h")) {
    usage()
    return
  }

  const emailRaw = readArg("--email") || process.env.SUPERADMIN_EMAIL
  const usernameRaw = readArg("--username") || process.env.SUPERADMIN_USERNAME
  const password = readArg("--password") || process.env.SUPERADMIN_PASSWORD

  if (!emailRaw) {
    console.error("Missing --email (or SUPERADMIN_EMAIL).")
    usage()
    process.exit(1)
  }

  const email = String(emailRaw).toLowerCase().trim()
  if (!email.includes("@")) {
    console.error("Invalid email.")
    process.exit(1)
  }

  const prisma = new PrismaClient()

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, username: true, role: true },
    })

    const now = new Date()

    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          role: "SUPERADMIN",
          planChosenAt: existing.role === "SUPERADMIN" ? undefined : now,
        },
      })

      console.log(`Promoted existing user to SUPERADMIN: ${existing.email} (@${existing.username})`)
      return
    }

    if (!usernameRaw) {
      console.error("Missing --username (or SUPERADMIN_USERNAME) when creating a new user.")
      process.exit(1)
    }
    if (!password || String(password).length < 8) {
      console.error("Missing --password (or SUPERADMIN_PASSWORD). Use at least 8 characters.")
      process.exit(1)
    }

    const username = String(usernameRaw).trim()
    if (!username) {
      console.error("Invalid username.")
      process.exit(1)
    }

    const passwordHash = await bcrypt.hash(String(password), 12)

    const created = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        emailVerifiedAt: now,
        role: "SUPERADMIN",
        planTier: "FREE",
        planActiveUntil: null,
        planChosenAt: now,
      },
      select: { id: true, email: true, username: true },
    })

    console.log(`Created SUPERADMIN user: ${created.email} (@${created.username})`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})

