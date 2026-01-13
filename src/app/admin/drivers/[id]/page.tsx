'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Edit, 
  Trash2,
  User,
  Phone,
  Mail,
  MapPin,
  BadgeCheck,
  Calendar,
  Briefcase
} from 'lucide-react'

interface Vehicle {
  id: string
  vehicleLicenseNumber: string | null
  vehicleType: {
    name: string
  } | null
}

interface Driver {
  id: string
  name: string
  contractNumber: string | null
  nidNumber: string | null
  districtName: string | null
  presentAddress: string | null
  permanentAddress: string | null
  drivingLicenseNumber: string | null
  experienceDuration: string | null
  picture: string | null
  createdAt: string
  vehicles: Vehicle[]
}

export default function DriverDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [driver, setDriver] = useState<Driver | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchDriver()
    }
  }, [id])

  const fetchDriver = async () => {
    try {
      const response = await fetch(`/api/drivers/${id}`)
      const data = await response.json()
      if (data.success) {
        setDriver(data.data)
      }
    } catch (error) {
      console.error('Error fetching driver:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!driver || !confirm('Are you sure you want to delete this driver?')) return
    
    try {
      const response = await fetch(`/api/drivers/${driver.id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        router.push('/admin/drivers')
      } else {
        console.error('Failed to delete driver')
      }
    } catch (error) {
      console.error('Error deleting driver:', error)
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading driver details...</div>
  }

  if (!driver) {
    return <div className="text-center py-10">Driver not found.</div>
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
            <h1 className="text-3xl font-bold text-gray-800">Driver Details</h1>
            <p className="text-gray-600 mt-1">Viewing details for {driver.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button
            onClick={() => router.push(`/admin/drivers/${driver.id}/edit`)}
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

      {/* Driver Info Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Left Side: Picture and Name */}
          <div className="md:w-1/3 bg-gray-50 p-8 flex flex-col items-center justify-center">
            <div className="relative h-32 w-32 rounded-full overflow-hidden ring-4 ring-primary-200">
              {driver.picture ? (
                <img src={driver.picture} alt={driver.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <User className="h-16 w-16 text-gray-500" />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">{driver.name}</h2>
            <p className="text-gray-600">Driver</p>
            <span className="mt-2 px-3 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
              Active
            </span>
          </div>

          {/* Right Side: Details */}
          <div className="md:w-2/3 p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mr-4 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{driver.contractNumber || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <BadgeCheck className="h-5 w-5 text-gray-400 mr-4 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">License No.</p>
                  <p className="font-medium text-gray-900">{driver.drivingLicenseNumber || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-400 mr-4 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">NID</p>
                  <p className="font-medium text-gray-900">{driver.nidNumber || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Briefcase className="h-5 w-5 text-gray-400 mr-4 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium text-gray-900">{driver.experienceDuration || 'N/A'}</p>
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
                  <p className="font-medium text-gray-900">{driver.districtName || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-4 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Present Address</p>
                  <p className="font-medium text-gray-900">{driver.presentAddress || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start col-span-full">
                <MapPin className="h-5 w-5 text-gray-400 mr-4 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Permanent Address</p>
                  <p className="font-medium text-gray-900">{driver.permanentAddress || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-8 py-4 bg-gray-50 text-sm text-gray-600 flex justify-between">
          <span>Joined on {new Date(driver.createdAt).toLocaleDateString()}</span>
          <span>Driver ID: {driver.id}</span>
        </div>
      </div>

      {/* Assigned Vehicles */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Assigned Vehicles</h3>
        <div className="bg-white rounded-lg shadow">
          {driver.vehicles && driver.vehicles.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {driver.vehicles.map(vehicle => (
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
              <p className="text-gray-500">No vehicles assigned to this driver.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
