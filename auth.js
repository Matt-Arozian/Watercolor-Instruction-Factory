import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { isEmailAllowed } from "@/lib/allowlist"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false
      return isEmailAllowed(user.email)
    },
  },
})
