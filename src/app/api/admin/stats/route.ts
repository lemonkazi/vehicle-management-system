import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const [totalVehicles, totalDrivers, totalOwners, activeVehicles, vehicleTypes, recentVehicles] =
      await Promise.all([
        prisma.vehicle.count(),
        prisma.driver.count(),
        prisma.owner.count(),
        prisma.vehicle.count({
          where: {
            OR: [{ status: 'LOADING' }, { status: 'UNLOADING' }, { status: 'AVAILABLE' }],
          },
        }),
        prisma.vehicleType.findMany(),
        prisma.vehicle.findMany({
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
        }),
      ])

    const vehiclesByType = await Promise.all(
      vehicleTypes.map(async (vehicleType) => {
        const count = await prisma.vehicle.count({
          where: { vehicleTypeId: vehicleType.id },
        })
        return { name: vehicleType.name, _count: { vehicles: count } }
      })
    )

    const recentVehiclesWithDetails = await Promise.all(
      recentVehicles.map(async (vehicle) => {
        const [vehicleType, driver] = await Promise.all([
          vehicle.vehicleTypeId
            ? prisma.vehicleType.findUnique({ where: { id: vehicle.vehicleTypeId } })
            : null,
          vehicle.driverId
            ? prisma.driver.findUnique({ where: { id: vehicle.driverId } })
            : null,
        ])
        return { ...vehicle, vehicleType, driver }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        totalVehicles,
        totalDrivers,
        totalOwners,
        activeVehicles,
        vehiclesByType,
        recentVehicles: recentVehiclesWithDetails,
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
