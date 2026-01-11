'use client'

import { useState, useEffect } from 'react'
import ImageSlider from '@/components/ImageSlider'
import VehicleList from '@/components/VehicleList'
import Sidebar from '@/components/Sidebar'

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

interface VehicleType {
  id: number
  name: string
}

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
  const [loading, setLoading] = useState(true)
  
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    status: 'AVAILABLE' // Default to available for public view
  })

  useEffect(() => {
    // Fetch initial data
    fetchVehicleTypes()
    fetchAndSetVehicles()
  }, [])

  const fetchVehicleTypes = async () => {
    try {
      const response = await fetch('/api/vehicle-types?limit=100')
      const data = await response.json()
      if (data.success) {
        setVehicleTypes(data.data)
      }
    } catch (error) {
      console.error('Error fetching vehicle types:', error)
    }
  }

  const fetchAndSetVehicles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '6',
        type: filters.type,
        location: filters.location,
        status: filters.status,
      })
      const response = await fetch(`/api/vehicles?${params.toString()}`)
      const data = await response.json()
      if (data.success) {
        setVehicles(data.data)
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchAndSetVehicles()
  }

  return (
    <>
      {/* Hero Section with Slider */}
      <section className="relative">
        <ImageSlider />
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Search and Filter Section */}
            <div className="mb-8">
              <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Your Vehicle</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type
                    </label>
                    <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="">All Types</option>
                      {vehicleTypes.map((type) => (
                        <option key={type.id} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="Enter location..."
                      value={filters.location}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="">All Status</option>
                      <option value="AVAILABLE">Available</option>
                      <option value="BUSY">Busy</option>
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <button type="submit" className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                      Search Vehicles
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Vehicle List Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Featured Vehicles</h2>
              </div>
              {loading ? (
                <div className="text-center py-10">Loading vehicles...</div>
              ) : (
                <VehicleList vehicles={vehicles} />
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  )
}
