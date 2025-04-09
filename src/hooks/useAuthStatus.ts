'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/api'

export function useAuthStatus() {
  const { data: session, status } = useSession()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      if (status === 'authenticated' && session) {
        try {
          const userData = await getCurrentUser()
          if (userData) {
            setUser(userData)
            setIsAuthenticated(true)
          } else {
            setIsAuthenticated(false)
            setUser(null)
          }
        } catch (error) {
          console.error('Error checking auth status:', error)
          setIsAuthenticated(false)
          setUser(null)
        }
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [session, status])

  return { isAuthenticated, user, isLoading }
}