// src/app/vehicle-types/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Truck, Car, Package, ShieldPlus } from 'lucide-react'

interface VehicleType {
  id: string
  name: string
  description?: string
  _count?: {
    vehicles: number
  }
}

export default function VehicleTypesPage() {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVehicleTypes()
  }, [])

  const fetchVehicleTypes = async () => {
    setLoading(true)
    try {
      // Assuming the API supports fetching all types without pagination for this public page
      const response = await fetch('/api/vehicle-types?limit=100') // Fetch a large number
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

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'truck':
        return <Truck className="h-10 w-10 text-primary-600" />
      case 'pickup':
        return <Car className="h-10 w-10 text-green-600" />
      case 'lorry':
        return <Package className="h-10 w-10 text-yellow-600" />
      case 'ambulance':
        return <ShieldPlus className="h-10 w-10 text-red-600" />
      default:
        return <Truck className="h-10 w-10 text-gray-600" />
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Vehicle Types</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We offer a diverse range of vehicle types to cater to all your logistical needs.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicleTypes.map((type) => (
              <Link href={`/vehicles?type=${type.name}`} key={type.id}>
                <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="flex justify-center items-center mb-4">
                    {getIcon(type.name)}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{type.name}</h3>
                  <p className="text-gray-600 mb-4 h-12 overflow-hidden">{type.description || 'No description available.'}</p>
                  <div className="inline-block bg-primary-100 text-primary-800 px-4 py-1 rounded-full text-sm font-semibold">
                    {type._count?.vehicles || 0} Vehicles Available
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
