import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const [
      totalVehicles,
      totalDrivers,
      totalOwners,
      activeVehicles,
      vehiclesByType,
      recentVehicles
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.driver.count(),
      prisma.owner.count(),
      prisma.vehicle.count({
        where: {
          OR: [
            { status: 'LOADING' },
            { status: 'UNLOADING' },
            { status: 'AVAILABLE' }
          ]
        }
      }),
      prisma.vehicleType.findMany({
        include: {
          _count: {
            select: { vehicles: true }
          }
        }
      }),
      prisma.vehicle.findMany({
        take: 5,
        include: {
          vehicleType: true,
          driver: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalVehicles,
        totalDrivers,
        totalOwners,
        activeVehicles,
        vehiclesByType,
        recentVehicles
      }
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}