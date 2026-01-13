'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Edit, 
  Trash2,
  User,
  Phone,
  MapPin,
  FileText,
  Calendar,
  Truck
} from 'lucide-react'

interface Vehicle {
  id: string
  vehicleLicenseNumber: string | null
  vehicleType: {
    name: string
  } | null
}

interface Owner {
  id: string
  name: string
  contractNumber: string | null
  nidNumber: string | null
  districtName: string | null
  presentAddress: string | null
  permanentAddress: string | null
  picture: string | null
  createdAt: string
  vehicles: Vehicle[]
}

export default function OwnerDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [owner, setOwner] = useState<Owner | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchOwner()
    }
  }, [id])

  const fetchOwner = async () => {
    try {
      const response = await fetch(`/api/owners/${id}`)
      const data = await response.json()
      if (data.success) {
        setOwner(data.data)
      }
    } catch (error) {
      console.error('Error fetching owner:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!owner || !confirm('Are you sure you want to delete this owner?')) return
    
    try {
      const response = await fetch(`/api/owners/${owner.id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        router.push('/admin/owners')
      } else {
        console.error('Failed to delete owner')
      }
    } catch (error) {
      console.error('Error deleting owner:', error)
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading owner details...</div>
  }

  if (!owner) {
    return <div className="text-center py-10">Owner not found.</div>
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Owner Details</h1>
            <p className="text-gray-600 mt-1">Viewing details for {owner.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button
            onClick={() => router.push(`/admin/owners/${owner.id}/edit`)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Owner Info Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Left Side: Picture and Name */}
          <div className="md:w-1/3 bg-gray-50 p-8 flex flex-col items-center justify-center">
            <div className="relative h-32 w-32 rounded-full overflow-hidden ring-4 ring-primary-200">
              {owner.picture ? (
                <img src={owner.picture} alt={owner.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <User className="h-16 w-16 text-gray-500" />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">{owner.name}</h2>
            <p className="text-gray-600">Owner</p>
          </div>

          {/* Right Side: Details */}
          <div className="md:w-2/3 p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mr-4 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{owner.contractNumber || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <FileText className="h-5 w-5 text-gray-400 mr-4 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">NID</p>
                  <p className="font-medium text-gray-900">{owner.nidNumber || 'N/A'}</p>
                </div>
              </div>
            </div>

            <hr className="my-8" />

            <h3 className="text-xl font-bold text-gray-800 mb-6">Address Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-4 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">District</p>
                  <p className="font-medium text-gray-900">{owner.districtName || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-4 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Present Address</p>
                  <p className="font-medium text-gray-900">{owner.presentAddress || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start col-span-full">
                <MapPin className="h-5 w-5 text-gray-400 mr-4 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Permanent Address</p>
                  <p className="font-medium text-gray-900">{owner.permanentAddress || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-8 py-4 bg-gray-50 text-sm text-gray-600 flex justify-between">
          <span>Joined on {new Date(owner.createdAt).toLocaleDateString()}</span>
          <span>Owner ID: {owner.id}</span>
        </div>
      </div>

      {/* Owned Vehicles */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Owned Vehicles</h3>
        <div className="bg-white rounded-lg shadow">
          {owner.vehicles && owner.vehicles.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {owner.vehicles.map(vehicle => (
                <li key={vehicle.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{vehicle.vehicleType?.name || 'Unknown Type'}</p>
                    <p className="text-sm text-gray-600">{vehicle.vehicleLicenseNumber || 'No License Plate'}</p>
                  </div>
                  <button 
                    onClick={() => router.push(`/vehicles/${vehicle.id}`)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View Vehicle
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No vehicles owned by this person.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
