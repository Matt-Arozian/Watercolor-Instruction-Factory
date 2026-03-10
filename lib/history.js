import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  unlinkSync,
} from "fs"
import { join } from "path"

const HISTORY_DIR = join(process.cwd(), "data", "history")

function sanitizeEmail(email) {
  return email.toLowerCase().trim().replace(/@/g, "_at_").replace(/\./g, "_")
}

function userDir(email) {
  const dir = join(HISTORY_DIR, sanitizeEmail(email))
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return dir
}

export function saveAnalysis(email, { id, thumbnail, analysis }) {
  const dir = userDir(email)
  const entry = {
    id,
    createdAt: new Date().toISOString(),
    imageDescription: analysis.imageDescription || "",
    thumbnail,
    analysis,
  }
  writeFileSync(join(dir, `${id}.json`), JSON.stringify(entry, null, 2))
  return entry
}

export function listAnalyses(email) {
  const dir = join(HISTORY_DIR, sanitizeEmail(email))
  if (!existsSync(dir)) return []

  const files = readdirSync(dir).filter((f) => f.endsWith(".json"))
  const entries = files
    .map((f) => {
      try {
        const raw = readFileSync(join(dir, f), "utf8")
        const entry = JSON.parse(raw)
        return {
          id: entry.id,
          createdAt: entry.createdAt,
          imageDescription: entry.imageDescription,
          thumbnail: entry.thumbnail,
        }
      } catch {
        return null
      }
    })
    .filter(Boolean)

  entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return entries
}

export function getAnalysis(email, id) {
  if (!/^[a-f0-9-]{36}$/.test(id)) return null

  const filePath = join(HISTORY_DIR, sanitizeEmail(email), `${id}.json`)
  if (!existsSync(filePath)) return null
  try {
    return JSON.parse(readFileSync(filePath, "utf8"))
  } catch {
    return null
  }
}

export function deleteAnalysis(email, id) {
  if (!/^[a-f0-9-]{36}$/.test(id)) return { error: "Invalid ID" }

  const filePath = join(HISTORY_DIR, sanitizeEmail(email), `${id}.json`)
  if (!existsSync(filePath)) return { error: "Not found" }

  unlinkSync(filePath)
  return { ok: true }
}
