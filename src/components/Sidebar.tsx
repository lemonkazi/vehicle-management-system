'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Truck, LogIn, UserPlus, Search, Filter, TrendingUp } from 'lucide-react'

export default function Sidebar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login attempt:', loginForm)
  }

  const vehicleTypes = [
    { name: 'Truck', count: 45, icon: '🚚' },
    { name: 'Pickup', count: 30, icon: '🛻' },
    { name: 'Lorry', count: 25, icon: '🚛' },
    { name: 'Car', count: 20, icon: '🚗' },
    { name: 'Car', count: 10, icon: '🚑' },
  ]

  return (
    <div className="space-y-6">
      {/* Login/Register Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">User Account</h3>
        
        {isLoginOpen ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                <LogIn className="h-4 w-4 inline mr-2" />
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLoginOpen(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="w-full flex items-center justify-center bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Login to Your Account
            </button>
            
            <Link
              href="/register"
              className="w-full flex items-center justify-center border-2 border-primary-600 text-primary-600 px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors font-medium"
            >
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

      {/* Vehicle Types */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Vehicle Types</h3>
          <Truck className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="space-y-3">
          {vehicleTypes.map((type) => (
            <div key={type.name} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center">
                <span className="text-xl mr-3">{type.icon}</span>
                <span className="font-medium text-gray-700">{type.name}</span>
              </div>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                {type.count}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Link
            href="/vehicle-types"
            className="flex items-center justify-center text-primary-600 hover:text-primary-700 font-medium"
          >
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