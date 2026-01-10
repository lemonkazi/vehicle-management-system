// hooks/useAuth.ts
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  exp: number
  // Add other token fields if needed
}

export function useAuth() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const role = localStorage.getItem('user_role')

    if (!token) {
      setIsAuthenticated(false)
      setUserRole(null)
      return
    }

    try {
      const decodedToken: DecodedToken = jwtDecode(token)
      if (decodedToken.exp * 1000 < Date.now()) {
        // Token expired
        localStorage.removeItem('admin_token')
        localStorage.removeItem('user_role')
        setIsAuthenticated(false)
        setUserRole(null)
        router.push('/login')
      } else {
        setIsAuthenticated(true)
        setUserRole(role)
      }
    } catch (error) {
      console.error('Invalid token:', error)
      localStorage.removeItem('admin_token')
      localStorage.removeItem('user_role')
      setIsAuthenticated(false)
      setUserRole(null)
      router.push('/login')
    }
  }, [router])

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('user_role')
    setIsAuthenticated(false)
    setUserRole(null)
    router.push('/login')
  }

  return { isAuthenticated, userRole, logout }
}