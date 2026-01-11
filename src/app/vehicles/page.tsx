// src/app/vehicles/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Truck } from 'lucide-react'
import VehicleCard from '@/components/VehicleCard' // Assuming this component exists and is styled for public view

interface Vehicle {
  id: number
  vehicleLicenseNumber?: string
  status: string
  vehiclePic?: string
  vehicleType?: {
    name: string
  }
  vehicleLocation?: string
  serviceArea?: string
}

interface Pagination {
  page: number
  pages: number
  total: number
}

export default function VehiclesPage() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')

  useEffect(() => {
    fetchVehicles(currentPage, searchTerm, locationFilter)
  }, [currentPage, searchTerm, locationFilter])

  const fetchVehicles = async (page: number, search: string, location: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9',
        search,
        location,
        status: 'AVAILABLE' // Public users should only see available vehicles
      })
      const response = await fetch(`/api/vehicles?${params.toString()}`)
      const data = await response.json()
      if (data.success) {
        setVehicles(data.data)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Header and Filters */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Fleet</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect vehicle for your needs. Browse our available fleet below.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-12 sticky top-20 z-40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by type, license plate..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : vehicles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map(vehicle => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
            {/* Pagination Controls */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm">
                  Page {pagination?.page} of {pagination?.pages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(pagination?.pages || 1, p + 1))}
                  disabled={currentPage === pagination?.pages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">No Vehicles Found</h3>
            <p className="text-gray-500 mt-2">
              No available vehicles match your criteria. Please try a different search.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
