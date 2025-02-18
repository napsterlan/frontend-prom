import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { login } from "@/api/apiClient"

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not set")
}

const handler = NextAuth({
    providers: [
      CredentialsProvider({
        // ... existing credentials config ...
        async authorize(credentials) {
          try {
            if (!credentials?.email || !credentials?.password) {
              return null
            }
  
            const response = await login(credentials.email, credentials.password)
            console.log('Login response:', response) // Debug log
            
            if (response.data?.user) {
              return {
                id: response.data.user.id?.toString(),
                email: response.data.user.email,
                name: response.data.user.name,
                role: response.data.user.role,
                token: response.data.jwt // Store the token from your API
              }
            }
            return null
          } catch (error) {
            console.error("Auth error:", error)
            return null // Return null instead of throwing
          }
        }
      })
    ],
    callbacks: {
      async jwt({ token, user }) {
        // When user signs in, add their data to the token
        console.log('JWT token:', token)
        console.log('User:', user)
        if (user) {
          token.id = user.id
          token.email = user.email
          token.name = user.name
          token.role = user.role
          token.jwt = user.token // Add the API token to JWT
        }
        return token
      },
      async session({ session, token }) {
        console.log('Session token:', token)
        console.log('Session:', session)
        // Add the token and user data to the session
        if (session.user) {
          session.user.id = token.id
          session.user.email = token.email
          session.user.name = token.name
          session.user.role = token.role
          session.jwt = token.jwt // Add API token to session
        }
        return session
      },
      async authorized({ req, token }) {
        console.log('Authorization Check:', { 
          path: req.nextUrl?.pathname,
          hasToken: !!token,
          token: token 
        })
        
        // Check for protected routes
        if (req.nextUrl?.pathname.startsWith('/admin')) {
          return token?.role === 'admin'
        }

        if (req.nextUrl?.pathname.startsWith('/api/auth')) {
            return true // Always allow auth endpoints
          }
        
        // For other protected routes, just check if user is logged in
        return !!token
      }
    },
    pages: {
      signIn: '/login',
      error: '/auth/error',
    },
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    debug: true // Keep debug mode on while troubleshooting
  })

export { handler as GET, handler as POST }