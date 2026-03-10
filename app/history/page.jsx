import { auth } from "@/auth"
import { redirect } from "next/navigation"
import HistoryPage from "@/components/history-page"

export default async function History() {
  const session = await auth()
  if (!session) redirect("/login")
  return <HistoryPage />
}
