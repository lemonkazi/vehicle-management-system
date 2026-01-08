'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Truck,
  Car,
  Package,
  ShieldPlus,
  MoreVertical
} from 'lucide-react'

interface VehicleType {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  vehicles?: Array<{ id: number }>
}

export default function AdminVehicleTypesPage() {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingType, setEditingType] = useState<VehicleType | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    fetchVehicleTypes()
  }, [])

  const fetchVehicleTypes = async () => {
    try {
      const response = await fetch('/api/vehicle-types')
      const data = await response.json()
      if (data.success) {
        setVehicleTypes(data.data)
      }
    } catch (error) {
      console.error('Error fetching vehicle types:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTypes = vehicleTypes.filter(type =>
    !searchTerm ||
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'truck':
        return <Truck className="h-8 w-8 text-blue-600" />
      case 'pickup':
        return <Car className="h-8 w-8 text-green-600" />
      case 'lorry':
        return <Package className="h-8 w-8 text-yellow-600" />
      case 'ambulance':
        return <ShieldPlus className="h-8 w-8 text-red-600" />
      default:
        return <Truck className="h-8 w-8 text-gray-600" />
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const url = editingType ? `/api/vehicle-types/${editingType.id}` : '/api/vehicle-types'
    const method = editingType ? 'PUT' : 'POST'
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (data.success) {
        if (editingType) {
          setVehicleTypes(vehicleTypes.map(type => 
            type.id === editingType.id ? data.data : type
          ))
        } else {
          setVehicleTypes([...vehicleTypes, data.data])
        }
        
        setFormData({ name: '', description: '' })
        setEditingType(null)
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error saving vehicle type:', error)
    }
  }

  const handleEdit = (type: VehicleType) => {
    setEditingType(type)
    setFormData({
      name: type.name,
      description: type.description || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this vehicle type?')) return
    
    try {
      const response = await fetch(`/api/vehicle-types/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setVehicleTypes(vehicleTypes.filter(type => type.id !== id))
      }
    } catch (error) {
      console.error('Error deleting vehicle type:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Vehicle Types</h1>
          <p className="text-gray-600 mt-2">Manage vehicle categories in the system</p>
        </div>
        <button
          onClick={() => {
            setEditingType(null)
            setFormData({ name: '', description: '' })
            setShowForm(true)
          }}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle Type
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search vehicle types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Vehicle Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTypes.map((type) => (
          <div key={type.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    {getIcon(type.name)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-800">{type.name}</h3>
                    <p className="text-sm text-gray-600">
                      {type.vehicles?.length || 0} vehicles
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => {
                      const menu = document.getElementById(`menu-${type.id}`)
                      if (menu) menu.classList.toggle('hidden')
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  <div 
                    id={`menu-${type.id}`}
                    className="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                  >
                    <button
                      onClick={() => {
                        handleEdit(type)
                        const menu = document.getElementById(`menu-${type.id}`)
                        if (menu) menu.classList.add('hidden')
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(type.id)
                        const menu = document.getElementById(`menu-${type.id}`)
                        if (menu) menu.classList.add('hidden')
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              
              {type.description && (
                <p className="text-gray-600 mb-4">{type.description}</p>
              )}
              
              <div className="text-sm text-gray-500">
                Created: {new Date(type.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingType ? 'Edit Vehicle Type' : 'Add New Vehicle Type'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Truck, Pickup, Lorry"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Optional description of this vehicle type"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingType(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {editingType ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}