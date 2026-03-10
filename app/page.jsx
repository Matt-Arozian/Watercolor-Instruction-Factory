import { auth } from "@/auth"
import { redirect } from "next/navigation"
import WatercolorFactory from "@/components/watercolor-factory"

export default async function Home() {
  const session = await auth()
  if (!session) redirect("/login")
  return <WatercolorFactory />
}
