// src/app/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('Password reset requested for:', email)
    
    setSubmitStatus('success')
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email and we'll send you a reset link.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          {submitStatus === 'success' ? (
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-900">Check your email</h3>
              <p className="mt-2 text-gray-600">
                If an account with that email exists, we've sent instructions to reset your password.
              </p>
              <div className="mt-6">
                <Link href="/login" className="w-full flex items-center justify-center bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>

              <div>
                <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:bg-primary-300">
                  <Mail className="h-5 w-5 mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
