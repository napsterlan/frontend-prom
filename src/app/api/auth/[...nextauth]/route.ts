import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { login } from "@/api/apiClient"
import { authOptions } from "./auth.config"

const secret = process.env.NEXT_PUBLIC_NEXTAUTH_SECRET
console.log('Checking NEXTAUTH_SECRET:', !!secret) // Debug l
if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not set")
  }

  const handler = NextAuth({
    ...authOptions,
    secret: secret
  })
//   })

export { handler as GET, handler as POST }