import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
    }
    jwt: string
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    token: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    jwt: string
  }
}