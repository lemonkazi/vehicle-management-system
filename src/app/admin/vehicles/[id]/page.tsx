'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Edit, 
  Trash2,
  Truck,
  User,
  Building,
  Tag,
  MapPin,
  Package,
  Tool,
  Hash,
  CheckCircle,
  Clock
} from 'lucide-react'

interface Vehicle {
  id: number
  vehicleLicenseNumber: string | null
  engineNumber: string | null
  chassisNumber: string | null
  vehicleCapacity: string | null
  vehicleLocation: string | null
  serviceArea: string | null
  status: string
  vehiclePic: string | null
  createdAt: string
  vehicleType: {
    id: number
    name: string
  } | null
  driver: {
    id: number
    name: string
  } | null
  owner: {
    id: number
    name: string
  } | null
}

export default function VehicleDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchVehicle()
    }
  }, [id])

  const fetchVehicle = async () => {
    try {
      const response = await fetch(`/api/vehicles/${id}`)
      const data = await response.json()
      if (data.success) {
        setVehicle(data.data)
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!vehicle || !confirm('Are you sure you want to delete this vehicle?')) return
    
    try {
      const response = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        router.push('/admin/vehicles')
      } else {
        console.error('Failed to delete vehicle')
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }
  
  const getStatusPill = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <div className="flex items-center text-green-600"><CheckCircle className="h-4 w-4 mr-1" /> Available</div>
      case 'BUSY':
        return <div className="flex items-center text-red-600"><Clock className="h-4 w-4 mr-1" /> Busy</div>
      default:
        return <div className="flex items-center text-yellow-600"><Clock className="h-4 w-4 mr-1" /> {status}</div>
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading vehicle details...</div>
  }

  if (!vehicle) {
    return <div className="text-center py-10">Vehicle not found.</div>
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
            <h1 className="text-3xl font-bold text-gray-800">Vehicle Details</h1>
            <p className="text-gray-600 mt-1">{vehicle.vehicleLicenseNumber || `ID: ${vehicle.id}`}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button
            onClick={() => router.push(`/admin/vehicles/${vehicle.id}/edit`)}
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

      {/* Vehicle Info Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left Side: Picture */}
          <div className="md:col-span-1 p-8 bg-gray-50 flex flex-col items-center justify-center">
            <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
              {vehicle.vehiclePic ? (
                <img src={vehicle.vehiclePic} alt="Vehicle" className="h-full w-full object-cover" />
              ) : (
                <Truck className="h-24 w-24 text-gray-400" />
              )}
            </div>
             <div className="mt-4 text-lg font-bold">{getStatusPill(vehicle.status)}</div>
          </div>

          {/* Right Side: Details */}
          <div className="md:col-span-2 p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <h3 className="sm:col-span-2 text-xl font-bold text-gray-800 mb-2 border-b pb-2">Vehicle Information</h3>
              
              <InfoItem icon={<Tag />} label="Type" value={vehicle.vehicleType?.name} link={`/admin/vehicle-types/${vehicle.vehicleType?.id}`} />
              <InfoItem icon={<Hash />} label="License Plate" value={vehicle.vehicleLicenseNumber} />
              <InfoItem icon={<Tool />} label="Engine No." value={vehicle.engineNumber} />
              <InfoItem icon={<Tool />} label="Chassis No." value={vehicle.chassisNumber} />
              <InfoItem icon={<Package />} label="Capacity" value={vehicle.vehicleCapacity} />
              <InfoItem icon={<MapPin />} label="Location" value={vehicle.vehicleLocation} />
              <InfoItem icon={<MapPin />} label="Service Area" value={vehicle.serviceArea} />

              <h3 className="sm:col-span-2 text-xl font-bold text-gray-800 mt-6 mb-2 border-b pb-2">Assignments</h3>
              
              <InfoItem icon={<User />} label="Driver" value={vehicle.driver?.name} link={`/admin/drivers/${vehicle.driver?.id}`} />
              <InfoItem icon={<Building />} label="Owner" value={vehicle.owner?.name} link={`/admin/owners/${vehicle.owner?.id}`} />
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-8 py-4 bg-gray-50 text-sm text-gray-600 flex justify-between">
          <span>Registered on {new Date(vehicle.createdAt).toLocaleDateString()}</span>
          <span>Vehicle ID: {vehicle.id}</span>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ icon, label, value, link }: { icon: React.ReactNode, label: string, value: string | null | undefined, link?: string }) {
  const router = useRouter()
  const content = (
    <>
      <div className="text-gray-400">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`font-medium text-gray-900 ${link ? 'hover:underline cursor-pointer' : ''}`}>{value || 'N/A'}</p>
      </div>
    </>
  )
  
  if (link && value) {
    return <div onClick={() => router.push(link)} className="flex items-center gap-4">{content}</div>
  }
  
  return <div className="flex items-center gap-4">{content}</div>
}
