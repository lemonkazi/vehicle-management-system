'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Truck, LogIn, UserPlus, Search, Filter, TrendingUp } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface VehicleType {
  id: number
  name: string
  vehicles: Array<{ id: number }>
}

const getIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case 'truck': return '🚚'
    case 'pickup': return '🛻'
    case 'lorry': return '🚛'
    case 'car': return '🚗'
    case 'ambulance': return '🚑'
    default: return '⚙️'
  }
}

export default function Sidebar() {
  const router = useRouter()
  const { isAuthenticated, login } = useAuth()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])

  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const response = await fetch('/api/vehicle-types?limit=5') // Fetch top 5 for sidebar
        const data = await response.json()
        if (data.success) {
          setVehicleTypes(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch vehicle types for sidebar", error)
      }
    }
    fetchVehicleTypes()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    try {
      await login(loginForm.email, loginForm.password)
      setIsLoginOpen(false)
      router.push('/admin') // Redirect to admin dashboard on successful login
    } catch (error) {
      setLoginError('Invalid email or password.')
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Login/Register Card */}
      {!isAuthenticated && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">User Account</h3>
          
          {isLoginOpen ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" required value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input type="password" required value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="••••••••" />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                  <LogIn className="h-4 w-4 inline mr-2" />
                  Login
                </button>
                <button type="button" onClick={() => setIsLoginOpen(false)} className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <button onClick={() => setIsLoginOpen(true)} className="w-full flex items-center justify-center bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                <LogIn className="h-5 w-5 mr-2" />
                Login to Your Account
              </button>
              <Link href="/register" className="w-full flex items-center justify-center border-2 border-primary-600 text-primary-600 px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors font-medium">
                <UserPlus className="h-5 w-5 mr-2" />
                Create New Account
              </Link>
              <div className="text-center text-sm text-gray-500 mt-4">
                <Link href="/forgot-password" className="text-primary-600 hover:text-primary-700">
                  Forgot password?
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vehicle Types */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Vehicle Types</h3>
          <Truck className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="space-y-3">
          {vehicleTypes.map((type) => (
            <Link href={`/vehicles?type=${type.name}`} key={type.id}>
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center">
                  <span className="text-xl mr-3">{getIcon(type.name)}</span>
                  <span className="font-medium text-gray-700">{type.name}</span>
                </div>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                  {type.vehicles?.length || 0}
                </span>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Link href="/vehicle-types" className="flex items-center justify-center text-primary-600 hover:text-primary-700 font-medium">
            View All Types
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
