export function isEmailAllowed(email) {
  const allowlist = (process.env.ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  if (allowlist.length === 0) return false

  return allowlist.includes(email.toLowerCase())
}
