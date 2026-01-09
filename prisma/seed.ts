import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
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
  console.log('✅ Created admin user:', admin.email)

  // Create vehicle types
  const vehicleTypes = [
    { name: 'Truck', description: 'Heavy duty trucks for transportation' },
    { name: 'Pickup', description: 'Light pickup vehicles' },
    { name: 'Lorry', description: 'Medium to heavy lorries' },
    { name: 'Car', description: 'Personal and commercial cars' },
    { name: 'Ambulance', description: 'Emergency medical vehicles' },
    { name: 'Others', description: 'Other types of vehicles' }
  ]

  for (const type of vehicleTypes) {
    const vehicleType = await prisma.vehicleType.upsert({
      where: { name: type.name },
      update: {},
      create: type
    })
    console.log(`✅ Created vehicle type: ${vehicleType.name}`)
  }

  // Create sample drivers
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
    const createdDriver = await prisma.driver.upsert({
      where: { contractNumber: driver.contractNumber }, // Unique constraint field
      update: {}, // Update nothing if exists (or specify fields to update)
      create: driver
    })
    console.log(`✅ Upserted driver: ${createdDriver.name}`)
  }

  // Create sample owners - FIXED: Use upsert instead of create
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
    const createdOwner = await prisma.owner.upsert({
      where: { contractNumber: owner.contractNumber }, // Unique constraint field
      update: {}, // Update nothing if exists (or specify fields to update)
      create: owner
    })
    console.log(`✅ Upserted owner: ${createdOwner.name}`)
  }

  // Create sample vehicles - FIXED: Use upsert instead of create
  const vehicleTypeIds = await prisma.vehicleType.findMany({
    select: { id: true, name: true }
  })
  
  const driverIds = await prisma.driver.findMany({
    select: { id: true, contractNumber: true }
  })
  
  const ownerIds = await prisma.owner.findMany({
    select: { id: true, contractNumber: true }
  })

  const vehicles = [
    {
      vehicleTypeId: vehicleTypeIds.find(v => v.name === 'Truck')?.id,
      engineNumber: 'ENG123456',
      chassisNumber: 'CHS123456',
      vehicleLicenseNumber: 'DHAKA-1234',
      vehicleCapacity: '10 tons',
      vehicleLocation: 'Dhaka',
      serviceArea: 'Dhaka Division',
      status: 'AVAILABLE' as const,
      driverId: driverIds.find(d => d.contractNumber === '+1234567890')?.id,
      ownerId: ownerIds.find(o => o.contractNumber === '+1122334455')?.id
    },
    {
      vehicleTypeId: vehicleTypeIds.find(v => v.name === 'Pickup')?.id,
      engineNumber: 'ENG789012',
      chassisNumber: 'CHS789012',
      vehicleLicenseNumber: 'CTG-5678',
      vehicleCapacity: '1 ton',
      vehicleLocation: 'Chittagong',
      serviceArea: 'Chittagong Division',
      status: 'LOADING' as const,
      driverId: driverIds.find(d => d.contractNumber === '+9876543210')?.id,
      ownerId: ownerIds.find(o => o.contractNumber === '+9988776655')?.id
    },
    {
      vehicleTypeId: vehicleTypeIds.find(v => v.name === 'Lorry')?.id,
      engineNumber: 'ENG345678',
      chassisNumber: 'CHS345678',
      vehicleLicenseNumber: 'SYL-9012',
      vehicleCapacity: '8 tons',
      vehicleLocation: 'Sylhet',
      serviceArea: 'Sylhet Division',
      status: 'UNLOADING' as const,
      driverId: driverIds.find(d => d.contractNumber === '+1234567890')?.id,
      ownerId: ownerIds.find(o => o.contractNumber === '+1122334455')?.id
    }
  ]

  for (const vehicle of vehicles) {
    const createdVehicle = await prisma.vehicle.upsert({
      where: { engineNumber: vehicle.engineNumber }, // Assuming engineNumber is unique
      update: {}, // Update nothing if exists (or specify fields to update)
      create: vehicle
    })
    console.log(`✅ Upserted vehicle: ${createdVehicle.vehicleLicenseNumber}`)
  }

  console.log('🌱 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })