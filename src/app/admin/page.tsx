'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Truck, 
  Users, 
  UserCircle, 
  Package, 
  TrendingUp, 
  Activity,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

interface DashboardStats {
  totalVehicles: number
  totalDrivers: number
  totalOwners: number
  activeVehicles: number
  recentVehicles: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    totalDrivers: 0,
    totalOwners: 0,
    activeVehicles: 0,
    recentVehicles: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const recentActivity = [
    { id: 1, action: 'New vehicle added', user: 'Admin', time: '2 hours ago', icon: Truck },
    { id: 2, action: 'Vehicle status updated', user: 'Driver 1', time: '4 hours ago', icon: Activity },
    { id: 3, action: 'New driver registered', user: 'System', time: '1 day ago', icon: Users },
    { id: 4, action: 'Owner information updated', user: 'Admin', time: '2 days ago', icon: UserCircle },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Vehicles */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVehicles}</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg">
              <Truck className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span>+12% from last month</span>
          </div>
        </div>

        {/* Total Drivers */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Drivers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDrivers}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span>+8% from last month</span>
          </div>
        </div>

        {/* Total Owners */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Owners</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOwners}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <UserCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span>+5% from last month</span>
          </div>
        </div>

        {/* Active Vehicles */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeVehicles}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Activity className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Currently in service
          </div>
        </div>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Status Distribution */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Vehicle Status Distribution</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { label: 'Available', value: 45, color: 'bg-green-500', count: 45 },
                { label: 'Loading', value: 30, color: 'bg-yellow-500', count: 30 },
                { label: 'Unloading', value: 15, color: 'bg-blue-500', count: 15 },
                { label: 'Busy', value: 10, color: 'bg-red-500', count: 10 }
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-medium text-gray-900">{item.count} vehicles</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-100 rounded-lg mr-3">
                        <Icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{activity.action}</p>
                        <p className="text-sm text-gray-500">by {activity.user}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">{activity.time}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Vehicles */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Recent Vehicles</h3>
          <Link href="/admin/vehicles" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All →
          </Link>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentVehicles?.slice(0, 5).map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                          <Truck className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{vehicle.vehicleLicenseNumber || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{vehicle.engineNumber || 'No engine number'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {vehicle.vehicleType?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        {vehicle.vehicleLocation || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vehicle.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'LOADING' ? 'bg-yellow-100 text-yellow-800' :
                        vehicle.status === 'UNLOADING' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {new Date(vehicle.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/admin/vehicles/new"
          className="flex flex-col items-center justify-center p-6 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors border border-primary-100"
        >
          <div className="p-3 bg-primary-100 rounded-lg mb-3">
            <Truck className="h-6 w-6 text-primary-600" />
          </div>
          <span className="font-medium text-gray-800">Add Vehicle</span>
          <span className="text-sm text-gray-600 mt-1">Register new vehicle</span>
        </Link>
        
        <Link
          href="/admin/drivers/new"
          className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
        >
          <div className="p-3 bg-blue-100 rounded-lg mb-3">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <span className="font-medium text-gray-800">Add Driver</span>
          <span className="text-sm text-gray-600 mt-1">Register new driver</span>
        </Link>
        
        <Link
          href="/admin/owners/new"
          className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-100"
        >
          <div className="p-3 bg-green-100 rounded-lg mb-3">
            <UserCircle className="h-6 w-6 text-green-600" />
          </div>
          <span className="font-medium text-gray-800">Add Owner</span>
          <span className="text-sm text-gray-600 mt-1">Register new owner</span>
        </Link>
        
        <Link
          href="/admin/reports"
          className="flex flex-col items-center justify-center p-6 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors border border-yellow-100"
        >
          <div className="p-3 bg-yellow-100 rounded-lg mb-3">
            <Package className="h-6 w-6 text-yellow-600" />
          </div>
          <span className="font-medium text-gray-800">View Reports</span>
          <span className="text-sm text-gray-600 mt-1">Analytics & insights</span>
        </Link>
      </div>
    </div>
  )
}