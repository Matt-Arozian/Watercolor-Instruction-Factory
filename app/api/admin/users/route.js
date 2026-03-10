import { auth } from "@/auth"
import { isAdmin } from "@/lib/allowlist"
import { getAllowedEmails, addEmail, removeEmail } from "@/lib/users"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return null
  }
  return session
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const emails = getAllowedEmails()
  return Response.json({ emails })
}

export async function POST(req) {
  const session = await requireAdmin()
  if (!session) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const { email } = await req.json()
  if (!email || typeof email !== "string") {
    return Response.json({ error: "Email is required" }, { status: 400 })
  }

  const result = addEmail(email)
  if (result.error) {
    return Response.json({ error: result.error }, { status: 400 })
  }

  return Response.json({ ok: true })
}

export async function DELETE(req) {
  const session = await requireAdmin()
  if (!session) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const { email } = await req.json()
  if (!email || typeof email !== "string") {
    return Response.json({ error: "Email is required" }, { status: 400 })
  }

  // Prevent removing an admin's own email
  if (email.toLowerCase().trim() === session.user.email.toLowerCase()) {
    return Response.json({ error: "Cannot remove your own admin email" }, { status: 400 })
  }

  const result = removeEmail(email)
  if (result.error) {
    return Response.json({ error: result.error }, { status: 400 })
  }

  return Response.json({ ok: true })
}
