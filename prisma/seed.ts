import { PrismaClient, VehicleStatus } from '@prisma/client'

import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting MongoDB seed...')

  /* =======================
     Admin User
  ======================= */
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@vehicle.com' },
    update: {},
    create: {
      email: 'admin@vehicle.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  })

  console.log('✅ Admin user:', admin.email)

  /* =======================
     Vehicle Types
  ======================= */
  const vehicleTypes = [
    { name: 'Truck', description: 'Heavy duty trucks for transportation' },
    { name: 'Pickup', description: 'Light pickup vehicles' },
    { name: 'Lorry', description: 'Medium to heavy lorries' },
    { name: 'Car', description: 'Personal and commercial cars' },
    { name: 'Ambulance', description: 'Emergency medical vehicles' },
    { name: 'Others', description: 'Other types of vehicles' }
  ]

  for (const type of vehicleTypes) {
    await prisma.vehicleType.upsert({
      where: { name: type.name },
      update: {},
      create: type
    })
  }

  console.log('✅ Vehicle types seeded')

  /* =======================
     Drivers
  ======================= */
  const drivers = [
    {
      name: 'John Smith',
      contractNumber: '+1234567890',
      nidNumber: 'NID123456',
      districtName: 'Dhaka',
      presentAddress: '123 Main Street, Dhaka',
      permanentAddress: '456 Permanent Address, Dhaka',
      drivingLicenseNumber: 'DL123456',
      experienceDuration: '5 years'
    },
    {
      name: 'Mike Johnson',
      contractNumber: '+9876543210',
      nidNumber: 'NID789012',
      districtName: 'Chittagong',
      presentAddress: '789 Market Road, Chittagong',
      permanentAddress: '123 Home Address, Chittagong',
      drivingLicenseNumber: 'DL789012',
      experienceDuration: '3 years'
    }
  ]

  for (const driver of drivers) {
    await prisma.driver.upsert({
      where: { contractNumber: driver.contractNumber },
      update: {},
      create: driver
    })
  }

  console.log('✅ Drivers seeded')

  /* =======================
     Owners
  ======================= */
  const owners = [
    {
      name: 'Transport Ltd.',
      contractNumber: '+1122334455',
      nidNumber: 'COMP123456',
      districtName: 'Dhaka',
      presentAddress: '456 Business Street, Dhaka',
      permanentAddress: '789 Corporate Address, Dhaka'
    },
    {
      name: 'Logistics Corp',
      contractNumber: '+9988776655',
      nidNumber: 'COMP789012',
      districtName: 'Chittagong',
      presentAddress: '123 Port Road, Chittagong',
      permanentAddress: '456 Office Address, Chittagong'
    }
  ]

  for (const owner of owners) {
    await prisma.owner.upsert({
      where: { contractNumber: owner.contractNumber },
      update: {},
      create: owner
    })
  }

  console.log('✅ Owners seeded')

  /* =======================
     Vehicles
  ======================= */
  const vehicleTypesDb = await prisma.vehicleType.findMany()
  const driversDb = await prisma.driver.findMany()
  const ownersDb = await prisma.owner.findMany()

  const vehicles = [
    {
      engineNumber: 'ENG123456',
      chassisNumber: 'CHS123456',
      vehicleLicenseNumber: 'DHAKA-1234',
      vehicleCapacity: '10 tons',
      vehicleLocation: 'Dhaka',
      serviceArea: 'Dhaka Division',
      status: VehicleStatus.AVAILABLE,
      vehicleTypeId: vehicleTypesDb.find(v => v.name === 'Truck')!.id,
      driverId: driversDb.find(d => d.contractNumber === '+1234567890')!.id,
      ownerId: ownersDb.find(o => o.contractNumber === '+1122334455')!.id
    },
    {
      engineNumber: 'ENG789012',
      chassisNumber: 'CHS789012',
      vehicleLicenseNumber: 'CTG-5678',
      vehicleCapacity: '1 ton',
      vehicleLocation: 'Chittagong',
      serviceArea: 'Chittagong Division',
      status: VehicleStatus.LOADING,
      vehicleTypeId: vehicleTypesDb.find(v => v.name === 'Pickup')!.id,
      driverId: driversDb.find(d => d.contractNumber === '+9876543210')!.id,
      ownerId: ownersDb.find(o => o.contractNumber === '+9988776655')!.id
    }
  ]


  for (const vehicle of vehicles) {
    if (!vehicle.vehicleTypeId || !vehicle.driverId || !vehicle.ownerId) {
      throw new Error('Invalid vehicle reference detected')
    }

    await prisma.vehicle.upsert({
      where: { engineNumber: vehicle.engineNumber },
      update: {},
      create: vehicle
    })
  }

  console.log('✅ Vehicles seeded')
  console.log('🌱 MongoDB seed completed successfully')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })