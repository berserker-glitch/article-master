/*
  Runs `bunx prisma db push` while forcing DB_URL from this repo's .env.

  Why: Prisma (and dotenv) won't override an already-set DB_URL coming from your system/user env vars.

  Usage:
    bun scripts/prisma-db-push.js
    bun scripts/prisma-db-push.js -- --accept-data-loss
*/

/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("node:fs")
const path = require("node:path")
const { spawn } = require("node:child_process")

function parseDotEnv(contents) {
  const out = {}
  const lines = contents.split(/\r?\n/)
  for (const raw of lines) {
    const line = raw.trim()
    if (!line || line.startsWith("#")) continue

    const eq = line.indexOf("=")
    if (eq < 0) continue

    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()

    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    out[key] = value
  }
  return out
}

function main() {
  const root = path.resolve(__dirname, "..")
  const envPath = path.join(root, ".env")

  if (!fs.existsSync(envPath)) {
    console.error(`Missing .env at ${envPath}`)
    process.exit(1)
  }

  const env = parseDotEnv(fs.readFileSync(envPath, "utf8"))
  const dbUrl = env.DB_URL

  if (!dbUrl) {
    console.error("DB_URL is missing in .env")
    process.exit(1)
  }

  if (!dbUrl.startsWith("mysql://")) {
    console.error("DB_URL must start with mysql:// (check your .env)")
    console.error(`Current DB_URL: ${dbUrl}`)
    process.exit(1)
  }

  // Forward prisma args after `--`
  const idx = process.argv.indexOf("--")
  const extraArgs = idx >= 0 ? process.argv.slice(idx + 1) : []

  const child = spawn(
    "bunx",
    ["prisma", "db", "push", ...extraArgs],
    {
      cwd: root,
      stdio: "inherit",
      env: {
        ...process.env,
        // Force override even if user/system env has DB_URL
        DB_URL: dbUrl,
      },
      shell: true,
    }
  )

  child.on("exit", (code) => process.exit(code ?? 1))
}

main()