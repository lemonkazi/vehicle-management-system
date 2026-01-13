import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Truck, MapPin, Users, Calendar, Phone, Mail, Building, Shield, Clock, Hash, Wrench } from 'lucide-react'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: params.id },
  })

  if (!vehicle) {
    return {
      title: 'Vehicle Not Found',
      description: 'The requested vehicle could not be found.',
    }
  }

  const vehicleType = vehicle.vehicleTypeId
    ? await prisma.vehicleType.findUnique({ where: { id: vehicle.vehicleTypeId } })
    : null

  return {
    title: `${vehicleType?.name || 'Vehicle'} - ${vehicle.vehicleLicenseNumber || 'Details'}`,
    description: `${vehicleType?.name} available for ${vehicle.status.toLowerCase()} at ${vehicle.vehicleLocation}. Capacity: ${vehicle.vehicleCapacity}`,
    openGraph: {
      images: [vehicle.vehiclePic || '/default-vehicle.jpg'],
    },
  }
}

export default async function VehiclePage({ params }: { params: { id: string } }) {
  const vehicleData = await prisma.vehicle.findUnique({
    where: { id: params.id },
  })

  if (!vehicleData) {
    notFound()
  }

  const [vehicleType, driver, owner] = await Promise.all([
    vehicleData.vehicleTypeId
      ? prisma.vehicleType.findUnique({ where: { id: vehicleData.vehicleTypeId } })
      : null,
    vehicleData.driverId
      ? prisma.driver.findUnique({ where: { id: vehicleData.driverId } })
      : null,
    vehicleData.ownerId
      ? prisma.owner.findUnique({ where: { id: vehicleData.ownerId } })
      : null,
  ])

  const vehicle = { ...vehicleData, vehicleType, driver, owner }

  if (!vehicle) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'loading':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'unloading':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'busy':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><a href="/" className="hover:text-primary-600">Home</a></li>
            <li>/</li>
            <li><a href="/vehicles" className="hover:text-primary-600">Vehicles</a></li>
            <li>/</li>
            <li className="text-gray-800 font-medium">{vehicle.vehicleLicenseNumber}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Vehicle Images & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Vehicle Images */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-96 w-full">
                <Image
                  src={vehicle.vehiclePic || '/default-vehicle.jpg'}
                  alt={vehicle.vehicleLicenseNumber || 'Vehicle'}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-4 py-2 rounded-full font-semibold border ${getStatusColor(vehicle.status)}`}>
                    {vehicle.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      {vehicle.vehicleType?.name || 'Vehicle'}
                    </h1>
                    <p className="text-gray-600">License: {vehicle.vehicleLicenseNumber || 'N/A'}</p>
                  </div>
                  <Truck className="h-12 w-12 text-primary-600" />
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Vehicle Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Hash className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-700">Engine Number</h3>
                      <p className="text-gray-900">{vehicle.engineNumber || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Wrench className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-700">Chassis Number</h3>
                      <p className="text-gray-900">{vehicle.chassisNumber || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-700">Vehicle Capacity</h3>
                      <p className="text-gray-900">{vehicle.vehicleCapacity || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-700">Current Location</h3>
                      <p className="text-gray-900">{vehicle.vehicleLocation || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Building className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-700">Service Area</h3>
                      <p className="text-gray-900">{vehicle.serviceArea || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-700">Last Updated</h3>
                      <p className="text-gray-900">
                        {new Date(vehicle.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Driver & Owner Info */}
          <div className="space-y-8">
            {/* Driver Information */}
            {vehicle.driver && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-6">
                  <Users className="h-6 w-6 text-primary-600 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-800">Driver Information</h2>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gray-200">
                    {vehicle.driver.picture ? (
                      <Image
                        src={vehicle.driver.picture}
                        alt={vehicle.driver.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-2xl font-semibold text-gray-600">
                        {vehicle.driver.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800">{vehicle.driver.name}</h3>
                    <p className="text-gray-600">Driver</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Driving License</h4>
                    <p className="text-gray-900">{vehicle.driver.drivingLicenseNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Experience</h4>
                    <p className="text-gray-900">{vehicle.driver.experienceDuration || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Contact</h4>
                    <p className="text-gray-900">{vehicle.driver.contractNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">NID Number</h4>
                    <p className="text-gray-900">{vehicle.driver.nidNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Address</h4>
                    <p className="text-gray-900">{vehicle.driver.presentAddress || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Owner Information */}
            {vehicle.owner && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-6">
                  <Shield className="h-6 w-6 text-green-600 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-800">Owner Information</h2>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gray-200">
                    {vehicle.owner.picture ? (
                      <Image
                        src={vehicle.owner.picture}
                        alt={vehicle.owner.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-2xl font-semibold text-gray-600">
                        {vehicle.owner.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800">{vehicle.owner.name}</h3>
                    <p className="text-gray-600">Owner</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Contact Number</h4>
                    <p className="text-gray-900">{vehicle.owner.contractNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">NID Number</h4>
                    <p className="text-gray-900">{vehicle.owner.nidNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">District</h4>
                    <p className="text-gray-900">{vehicle.owner.districtName || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Present Address</h4>
                    <p className="text-gray-900">{vehicle.owner.presentAddress || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Permanent Address</h4>
                    <p className="text-gray-900">{vehicle.owner.permanentAddress || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                  Book This Vehicle
                </button>
                <button className="w-full border-2 border-primary-600 text-primary-600 py-3 rounded-lg hover:bg-primary-50 transition-colors font-medium">
                  Contact Owner
                </button>
                <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Share Vehicle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}