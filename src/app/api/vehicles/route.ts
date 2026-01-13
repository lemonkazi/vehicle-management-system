import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    let where: any = {}

    if (status) {
      where.status = status.toUpperCase()
    }

    if (type) {
      where.vehicleTypeId = type
    }

    if (location) {
      where.vehicleLocation = {
        contains: location,
      }
    }

    console.log("WHERE CLAUSE:", JSON.stringify(where, null, 2));

    if (search) {
      where.OR = [
        { vehicleLicenseNumber: { contains: search } },
        { engineNumber: { contains: search } },
        { chassisNumber: { contains: search } },
        { serviceArea: { contains: search } },
      ]
    }

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.vehicle.count({ where }),
    ])

    const vehiclesWithDetails = await Promise.all(
      vehicles.map(async (vehicle) => {
        const [vehicleType, driver, owner] = await Promise.all([
          vehicle.vehicleTypeId
            ? prisma.vehicleType.findUnique({ where: { id: vehicle.vehicleTypeId } })
            : null,
          vehicle.driverId
            ? prisma.driver.findUnique({ where: { id: vehicle.driverId } })
            : null,
          vehicle.ownerId ? prisma.owner.findUnique({ where: { id: vehicle.ownerId } }) : null,
        ])
        return { ...vehicle, vehicleType, driver, owner }
      })
    )

    return NextResponse.json({
      success: true,
      data: vehiclesWithDetails,
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

    const data: any = { ...body }

    if (data.vehicleTypeId && !/^[0-9a-fA-F]{24}$/.test(data.vehicleTypeId)) {
      delete data.vehicleTypeId
    }
    if (data.driverId && !/^[0-9a-fA-F]{24}$/.test(data.driverId)) {
      delete data.driverId
    }
    if (data.ownerId && !/^[0-9a-fA-F]{24}$/.test(data.ownerId)) {
      delete data.ownerId
    }

    const vehicle = await prisma.vehicle.create({
      data,
    })

    const [vehicleType, driver, owner] = await Promise.all([
      vehicle.vehicleTypeId
        ? prisma.vehicleType.findUnique({ where: { id: vehicle.vehicleTypeId } })
        : null,
      vehicle.driverId
        ? prisma.driver.findUnique({ where: { id: vehicle.driverId } })
        : null,
      vehicle.ownerId ? prisma.owner.findUnique({ where: { id: vehicle.ownerId } }) : null,
    ])

    return NextResponse.json({
      success: true,
      data: { ...vehicle, vehicleType, driver, owner },
    })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create vehicle' },
      { status: 500 }
    )
  }
}
