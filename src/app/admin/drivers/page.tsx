'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  User,
  Phone,
  MapPin,
  BadgeCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface Driver {
  id: number
  name: string
  contractNumber?: string
  nidNumber?: string
  districtName?: string
  presentAddress?: string
  permanentAddress?: string
  drivingLicenseNumber?: string
  experienceDuration?: string
  picture?: string
  vehicles?: Array<{ id: number }>
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function AdminDriversPage() {
  const router = useRouter()
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchDrivers(currentPage, searchTerm)
  }, [currentPage, searchTerm])

  const fetchDrivers = async (page: number, search: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9', // 3x3 grid
        search,
      })
      const response = await fetch(`/api/drivers?${params.toString()}`)
      const data = await response.json()
      if (data.success) {
        setDrivers(data.data)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching drivers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this driver?')) return
    
    try {
      const response = await fetch(`/api/drivers/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        fetchDrivers(currentPage, searchTerm)
      }
    } catch (error) {
      console.error('Error deleting driver:', error)
    }
  }
  
  const PaginationComponent = () => {
    if (!pagination || pagination.total === 0) return null

    const { page, pages, total } = pagination
    const startItem = (page - 1) * 9 + 1
    const endItem = Math.min(page * 9, total)

    return (
      <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 mt-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{total}</span> drivers
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <span className="px-3 py-1 border border-gray-300 rounded text-sm bg-primary-50 text-primary-600 border-primary-300">
              {page}
            </span>

            <button 
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={page === pages}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Drivers</h1>
          <p className="text-gray-600 mt-2">Manage all drivers in the system</p>
        </div>
        <button
          onClick={() => router.push('/admin/drivers/new')}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Driver
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search drivers by name, phone, or license..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Drivers Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No drivers found</p>
              </div>
            ) : (
              drivers.map((driver) => (
                <div key={driver.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Driver Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="relative h-14 w-14 rounded-full overflow-hidden bg-gray-200">
                          {driver.picture ? (
                            <img
                              src={driver.picture}
                              alt={driver.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xl font-semibold text-gray-600">
                              {driver.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-bold text-gray-800">{driver.name}</h3>
                          <p className="text-sm text-gray-600">Driver</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => router.push(`/admin/drivers/${driver.id}/edit`)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(driver.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Driver Details */}
                  <div className="border-t border-gray-200 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-gray-500">Phone</p>
                          <p className="text-gray-900 font-medium">{driver.contractNumber || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <BadgeCheck className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-gray-500">License</p>
                          <p className="text-gray-900 font-medium">{driver.drivingLicenseNumber || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-gray-500">District</p>
                          <p className="text-gray-900 font-medium">{driver.districtName || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <div className="h-4 w-4 flex items-center justify-center mr-3">
                          <span className="text-xs text-gray-400">Exp</span>
                        </div>
                        <div>
                          <p className="text-gray-500">Experience</p>
                          <p className="text-gray-900 font-medium">{driver.experienceDuration || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {driver.vehicles?.length || 0} vehicles
                      </span>
                      <button
                        onClick={() => router.push(`/admin/drivers/${driver.id}`)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <PaginationComponent />
        </>
      )}
    </div>
  )
}
