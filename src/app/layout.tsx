import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { headers } from 'next/headers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vehicle Management System - Find Your Perfect Vehicle',
  description: 'Manage and find vehicles for loading, unloading and transportation services',
  keywords: 'vehicles, trucks, pickup, lorry, transportation, loading, unloading',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'Vehicle Management System',
    description: 'Find and manage vehicles for all your transportation needs',
    siteName: 'Vehicle Management System',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers()
  const pathname = headersList.get('x-invoke-path') || ''
  console.log("===========dd=");
  console.log(pathname);
  
  // Check if current route is admin route
  const isAdminRoute = pathname.startsWith('/admin')
  
  // Don't show header/footer for admin routes
  const showHeaderFooter = !isAdminRoute

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="11 min-h-screen flex flex-col">
          {showHeaderFooter && <Header />}
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}