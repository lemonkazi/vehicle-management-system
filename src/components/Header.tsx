// components/Header.tsx
'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Menu, X, Truck, Search } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth' // Adjust the import path

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, userRole, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Vehicles', href: '/vehicles' },
    { label: 'Vehicle Types', href: '/vehicle-types' },
    { label: 'Contact', href: '/contact' },
  ]

  const [showHeader, setShowHeader] = useState(true)

  useEffect(() => {
    const isAdminRoute = pathname.startsWith('/admin')
    setShowHeader(!isAdminRoute)
  }, [pathname])

  return (
    showHeader && (
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-800">VehicleSys</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Search and Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
              </div>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/admin"
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-gray-600 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="block bg-primary-600 text-white px-4 py-2 rounded-lg text-center hover:bg-primary-700 transition-colors mb-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setIsMenuOpen(false)
                        }}
                        className="block w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="block bg-primary-600 text-white px-4 py-2 rounded-lg text-center hover:bg-primary-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    )
  )
}