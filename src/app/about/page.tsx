// src/app/about/page.tsx
import { Building, Truck, Users, ShieldCheck } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-primary-600 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">About VehicleSys</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Revolutionizing logistics with reliable, efficient, and transparent vehicle management solutions.
          </p>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 text-lg">
            Our mission is to empower businesses by providing a seamless and powerful platform for managing their vehicle fleets. We aim to simplify logistics, reduce operational costs, and enhance productivity through innovative technology and dedicated support.
          </p>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-primary-100 text-primary-600 rounded-full p-4 mb-4">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Reliability</h3>
              <p className="text-gray-600">
                We are committed to providing a stable and dependable platform that our clients can trust for their critical operations.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 text-green-600 rounded-full p-4 mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Customer-Centric</h3>
              <p className="text-gray-600">
                Our customers are at the heart of everything we do. We listen, we learn, and we deliver solutions that meet their needs.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 text-blue-600 rounded-full p-4 mb-4">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Innovation</h3>
              <p className="text-gray-600">
                We constantly explore new technologies and ideas to improve our services and stay ahead in a fast-evolving industry.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img 
              src="/images/about-us.jpg" // Replace with an actual image in public/images
              alt="Our Team" 
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2023, VehicleSys started with a small team of logistics experts and software engineers who saw a gap in the market for an intuitive, all-in-one vehicle management system. Frustrated by clunky, outdated software, we set out to build something better.
            </p>
            <p className="text-gray-600">
              Today, VehicleSys is trusted by businesses of all sizes to manage thousands of vehicles, drivers, and operations daily. We are proud of our journey and excited for what's to come.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
