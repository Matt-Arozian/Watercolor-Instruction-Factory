export async function isEmailAllowed(email) {
  // Dynamic import to avoid bundling Node.js modules in edge runtime (middleware)
  const { getAllowedEmails } = await import("@/lib/users")
  const emails = getAllowedEmails()
  return emails.includes(email.toLowerCase().trim())
}

export function isAdmin(email) {
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  return admins.includes(email.toLowerCase().trim())
}
