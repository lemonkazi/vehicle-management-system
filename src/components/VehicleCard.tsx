import Image from 'next/image'
import Link from 'next/link'
import { Truck, MapPin, Users, Calendar } from 'lucide-react'

interface VehicleCardProps {
  vehicle: {
    id: number
    vehiclePic?: string
    vehicleLicenseNumber?: string
    vehicleCapacity?: string
    vehicleLocation?: string
    status: string
    vehicleType?: {
      name: string
    }
    driver?: {
      name: string
    }
  }
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'loading':
        return 'bg-yellow-100 text-yellow-800'
      case 'unloading':
        return 'bg-blue-100 text-blue-800'
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'busy':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Vehicle Image */}
      <div className="relative h-48 w-full">
        <Image
          src={vehicle.vehiclePic || '/default-vehicle.jpg'}
          alt={vehicle.vehicleLicenseNumber || 'Vehicle'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(vehicle.status)}`}>
            {vehicle.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {vehicle.vehicleType?.name || 'Vehicle'}
            </h3>
            <p className="text-gray-600 text-sm">ID: {vehicle.vehicleLicenseNumber || 'N/A'}</p>
          </div>
          <Truck className="h-8 w-8 text-primary-600" />
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <Users className="h-5 w-5 mr-2" />
            <span>Capacity: {vehicle.vehicleCapacity || 'N/A'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-2" />
            <span>Location: {vehicle.vehicleLocation || 'N/A'}</span>
          </div>
          {vehicle.driver && (
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2" />
              <span>Driver: {vehicle.driver.name}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center">
          <Link
            href={`/vehicles/${vehicle.id}`}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            View Details
          </Link>
          <span className="text-sm text-gray-500">Updated recently</span>
        </div>
      </div>
    </div>
  )
}