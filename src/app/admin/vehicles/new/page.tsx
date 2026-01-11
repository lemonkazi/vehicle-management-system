'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, UploadCloud, Image as ImageIcon } from 'lucide-react'

interface VehicleType {
  id: number
  name: string
}

interface Driver {
  id: number
  name: string
}

interface Owner {
  id: number
  name: string
}

export default function NewVehiclePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    vehicleTypeId: '',
    driverId: '',
    ownerId: '',
    engineNumber: '',
    chassisNumber: '',
    vehicleLicenseNumber: '',
    vehicleCapacity: '',
    vehicleLocation: '',
    serviceArea: '',
    status: 'AVAILABLE',
    vehiclePic: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [owners, setOwners] = useState<Owner[]>([])

  useEffect(() => {
    fetch('/api/vehicle-types').then(res => res.json()).then(data => setVehicleTypes(data.data))
    fetch('/api/drivers').then(res => res.json()).then(data => setDrivers(data.data))
    fetch('/api/owners').then(res => res.json()).then(data => setOwners(data.data))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setImagePreview(URL.createObjectURL(file))

    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })
      const data = await response.json()
      if (data.success) {
        setFormData({ ...formData, vehiclePic: data.url })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const submissionData = {
      ...formData,
      vehicleTypeId: formData.vehicleTypeId ? parseInt(formData.vehicleTypeId) : null,
      driverId: formData.driverId ? parseInt(formData.driverId) : null,
      ownerId: formData.ownerId ? parseInt(formData.ownerId) : null,
    }

    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      })

      if (response.ok) {
        router.push('/admin/vehicles')
      } else {
        console.error('Failed to create vehicle')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Add New Vehicle</h1>
            <p className="text-gray-600 mt-1">Enter the details of the new vehicle.</p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || uploading}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-300"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Saving...' : 'Save Vehicle'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type *</label>
                  <select name="vehicleTypeId" value={formData.vehicleTypeId} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select Type</option>
                    {vehicleTypes.map(vt => <option key={vt.id} value={vt.id}>{vt.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
                  <select name="driverId" value={formData.driverId} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select Driver</option>
                    {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                  <select name="ownerId" value={formData.ownerId} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select Owner</option>
                    {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                  <input type="text" name="vehicleLicenseNumber" value={formData.vehicleLicenseNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Engine Number</label>
                  <input type="text" name="engineNumber" value={formData.engineNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chassis Number</label>
                  <input type="text" name="chassisNumber" value={formData.chassisNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (e.g., 10 tons)</label>
                  <input type="text" name="vehicleCapacity" value={formData.vehicleCapacity} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
                  <input type="text" name="vehicleLocation" value={formData.vehicleLocation} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Area</label>
                  <input type="text" name="serviceArea" value={formData.serviceArea} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="AVAILABLE">Available</option>
                    <option value="BUSY">Busy</option>
                    <option value="LOADING">Loading</option>
                    <option value="UNLOADING">Unloading</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Vehicle Picture</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Vehicle preview" className="mx-auto h-32 w-auto object-contain rounded-md" />
                  ) : (
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                      <span>{uploading ? 'Uploading...' : 'Upload a file'}</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={uploading} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}