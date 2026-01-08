import ImageSlider from '@/components/ImageSlider'
import VehicleList from '@/components/VehicleList'
import Sidebar from '@/components/Sidebar'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

export default async function Home() {
  // Fetch featured vehicles for the homepage
  const featuredVehicles = await prisma.vehicle.findMany({
    take: 6,
    include: {
      vehicleType: true,
      driver: true,
      owner: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Fetch vehicle types for filtering
  const vehicleTypes = await prisma.vehicleType.findMany()

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
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Your Vehicle</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="">All Types</option>
                      {vehicleTypes.map((type) => (
                        <option key={type.id} value={type.id}>
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
                      placeholder="Enter location..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="">All Status</option>
                      <option value="available">Available</option>
                      <option value="loading">Loading</option>
                      <option value="unloading">Unloading</option>
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <button className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                      Search Vehicles
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle List Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Available Vehicles</h2>
                <span className="text-gray-600">
                  Showing {featuredVehicles.length} vehicles
                </span>
              </div>
              <VehicleList vehicles={featuredVehicles} />
            </section>

            {/* About Section */}
            <section className="mt-16">
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-8 rounded-2xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  About Our Vehicle Management System
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Loading Vehicles</h3>
                    <p className="text-gray-600">
                      Efficient loading services with trained professionals and modern equipment.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Unloading Vehicles</h3>
                    <p className="text-gray-600">
                      Safe and quick unloading services for all types of vehicles and cargo.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Vehicle Types</h3>
                    <p className="text-gray-600">
                      Wide range of vehicles including trucks, pickups, lorries, and more.
                    </p>
                  </div>
                </div>
              </div>
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