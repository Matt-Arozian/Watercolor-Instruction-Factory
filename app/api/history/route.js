import { auth } from "@/auth"
import { listAnalyses, deleteAnalysis } from "@/lib/history"

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const entries = listAnalyses(session.user.email)
  return Response.json({ entries })
}

export async function DELETE(request) {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 })
  }

  const { id } = body
  if (!id || typeof id !== "string") {
    return Response.json({ error: "Missing analysis ID" }, { status: 400 })
  }

  const result = deleteAnalysis(session.user.email, id)
  if (result.error) {
    return Response.json({ error: result.error }, { status: 404 })
  }

  return Response.json({ ok: true })
}
