import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    const where: any = {}

    if (type) {
      where.vehicleTypeId = parseInt(type)
    }

    if (location) {
      where.vehicleLocation = {
        contains: location,
        mode: 'insensitive' as const,
      }
    }

    if (status) {
      where.status = status.toUpperCase()
    }

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: {
          vehicleType: true,
          driver: true,
          owner: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.vehicle.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: vehicles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const vehicle = await prisma.vehicle.create({
      data: {
        vehicleTypeId: body.vehicleTypeId,
        engineNumber: body.engineNumber,
        chassisNumber: body.chassisNumber,
        vehicleLicenseNumber: body.vehicleLicenseNumber,
        vehicleCapacity: body.vehicleCapacity,
        vehicleLocation: body.vehicleLocation,
        serviceArea: body.serviceArea,
        status: body.status || 'AVAILABLE',
        vehiclePic: body.vehiclePic,
        driverId: body.driverId,
        ownerId: body.ownerId,
      },
      include: {
        vehicleType: true,
        driver: true,
        owner: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: vehicle,
    })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create vehicle' },
      { status: 500 }
    )
  }
}