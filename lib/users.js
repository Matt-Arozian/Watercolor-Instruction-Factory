import { readFileSync, writeFileSync, existsSync } from "fs"
import { join } from "path"

const DATA_PATH = join(process.cwd(), "data", "allowed-emails.json")

export function getAllowedEmails() {
  try {
    if (!existsSync(DATA_PATH)) return []
    const raw = readFileSync(DATA_PATH, "utf8")
    const emails = JSON.parse(raw)
    return Array.isArray(emails) ? emails.map((e) => e.toLowerCase().trim()) : []
  } catch {
    return []
  }
}

export function addEmail(email) {
  const normalized = email.toLowerCase().trim()
  if (!normalized) return { error: "Email is required" }

  const emails = getAllowedEmails()
  if (emails.includes(normalized)) return { error: "Email already exists" }

  emails.push(normalized)
  writeFileSync(DATA_PATH, JSON.stringify(emails, null, 2) + "\n")
  return { ok: true }
}

export function removeEmail(email) {
  const normalized = email.toLowerCase().trim()
  const emails = getAllowedEmails()
  const filtered = emails.filter((e) => e !== normalized)

  if (filtered.length === emails.length) return { error: "Email not found" }

  writeFileSync(DATA_PATH, JSON.stringify(filtered, null, 2) + "\n")
  return { ok: true }
}
