import { auth } from "@/auth"
import { getAnalysis } from "@/lib/history"

export async function GET(request, { params }) {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  if (!id) {
    return Response.json({ error: "Missing ID" }, { status: 400 })
  }

  const entry = getAnalysis(session.user.email, id)
  if (!entry) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  return Response.json(entry)
}
