import 'next-auth'

// Определение типа для сессии
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

  // Определение типа для пользователя
  interface User {
    id: string
    email: string
    name: string
    role: string
    token: string
  }
}

// Определение типа для JWT
declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    jwt: string
  }
}