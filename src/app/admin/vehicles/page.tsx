'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MoreVertical,
  Download,
  Truck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface Vehicle {
  id: number
  vehicleLicenseNumber?: string
  engineNumber?: string
  chassisNumber?: string
  vehicleCapacity?: string
  vehicleLocation?: string
  status: string
  vehiclePic?: string
  vehicleType?: {
    name: string
  }
  driver?: {
    name: string
  }
  owner?: {
    name: string
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

const vehicleStatuses = ['AVAILABLE', 'BUSY', 'LOADING', 'UNLOADING']

export default function AdminVehiclesPage() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null)

  useEffect(() => {
    fetchVehicles(currentPage, searchTerm, selectedStatus, selectedType)
  }, [currentPage, searchTerm, selectedStatus, selectedType])

  const fetchVehicles = async (page: number, search: string, status: string, type: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search,
        status,
        type
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

  const handleStatusChange = async (vehicleId: number, newStatus: string) => {
    // Optimistically update the UI
    setVehicles(vehicles.map(v => v.id === vehicleId ? { ...v, status: newStatus } : v))

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        // Revert the change on failure
        console.error("Failed to update status")
        fetchVehicles(currentPage, searchTerm, selectedStatus, selectedType) // Refetch to get the real state
      }
    } catch (error) {
      console.error('Error updating status:', error)
      fetchVehicles(currentPage, searchTerm, selectedStatus, selectedType)
    }
  }

  const handleDelete = async () => {
    if (!vehicleToDelete) return
    
    try {
      const response = await fetch(`/api/vehicles/${vehicleToDelete}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setShowDeleteModal(false)
        setVehicleToDelete(null)
        fetchVehicles(currentPage, searchTerm, selectedStatus, selectedType)
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'loading': return 'bg-yellow-100 text-yellow-800 ring-yellow-600/20'
      case 'unloading': return 'bg-blue-100 text-blue-800 ring-blue-600/20'
      case 'available': return 'bg-green-100 text-green-800 ring-green-600/20'
      case 'busy': return 'bg-red-100 text-red-800 ring-red-600/20'
      default: return 'bg-gray-100 text-gray-800 ring-gray-600/20'
    }
  }

  const exportToCSV = () => {
    const headers = ['ID', 'License Number', 'Type', 'Engine No', 'Chassis No', 'Capacity', 'Location', 'Status', 'Driver', 'Owner']
    const csvData = vehicles.map(v => [
      v.id,
      v.vehicleLicenseNumber || '',
      v.vehicleType?.name || '',
      v.engineNumber || '',
      v.chassisNumber || '',
      v.vehicleCapacity || '',
      v.vehicleLocation || '',
      v.status,
      v.driver?.name || '',
      v.owner?.name || ''
    ])
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vehicles.csv'
    a.click()
  }
  
  const PaginationComponent = () => {
    if (!pagination || pagination.total === 0) return null

    const { page, pages, total } = pagination
    const startItem = (page - 1) * 10 + 1
    const endItem = Math.min(page * 10, total)

    return (
      <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{total}</span> vehicles
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
          <h1 className="text-3xl font-bold text-gray-800">Vehicles</h1>
          <p className="text-gray-600 mt-2">Manage all vehicles in the system</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button onClick={exportToCSV} className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          <button onClick={() => router.push('/admin/vehicles/new')} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              {vehicleStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Types</option>
              <option value="Truck">Truck</option>
              <option value="Pickup">Pickup</option>
              <option value="Lorry">Lorry</option>
              <option value="Car">Car</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedStatus('')
                setSelectedType('')
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License No</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-10">Loading...</td></tr>
              ) : vehicles.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10">No vehicles found.</td></tr>
              ) : (
                vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Truck className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{vehicle.vehicleLicenseNumber || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{vehicle.engineNumber || 'No engine number'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.vehicleLicenseNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.vehicleType?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.vehicleLocation || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={vehicle.status}
                        onChange={(e) => handleStatusChange(vehicle.id, e.target.value)}
                        className={`w-full rounded-lg border-none text-xs font-medium focus:ring-2 focus:ring-primary-500 ${getStatusColor(vehicle.status)}`}
                      >
                        {vehicleStatuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.driver?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => router.push(`/admin/vehicles/${vehicle.id}`)} className="text-gray-500 hover:text-gray-700" title="View"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => router.push(`/admin/vehicles/${vehicle.id}/edit`)} className="text-blue-500 hover:text-blue-700" title="Edit"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => { setVehicleToDelete(vehicle.id); setShowDeleteModal(true); }} className="text-red-500 hover:text-red-700" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <PaginationComponent />
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Vehicle</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete this vehicle? This action cannot be undone.
              </p>
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}