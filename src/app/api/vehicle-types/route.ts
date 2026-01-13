import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const where: any = search
      ? {
          OR: [{ name: { contains: search } }, { description: { contains: search } }],
        }
      : {}

    if (page && limit) {
      const skip = (page - 1) * limit
      const [vehicleTypes, total] = await Promise.all([
        prisma.vehicleType.findMany({
          where,
          orderBy: {
            name: 'asc',
          },
          take: limit,
          skip: skip,
        }),
        prisma.vehicleType.count({ where }),
      ])

      const vehicleTypesWithVehicleCount = await Promise.all(
        vehicleTypes.map(async (vehicleType) => {
          const vehicleCount = await prisma.vehicle.count({
            where: { vehicleTypeId: vehicleType.id },
          })
          return { ...vehicleType, _count: { vehicles: vehicleCount } }
        })
      )

      return NextResponse.json({
        success: true,
        data: vehicleTypesWithVehicleCount,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      })
    } else {
      const vehicleTypes = await prisma.vehicleType.findMany({
        where,
        orderBy: {
          name: 'asc',
        },
      })
      return NextResponse.json({
        success: true,
        data: vehicleTypes,
      })
    }
  } catch (error) {
    console.error('Error fetching vehicle types:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicle types' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Vehicle type name is required' },
        { status: 400 }
      )
    }

    const vehicleType = await prisma.vehicleType.create({
      data: {
        name: body.name,
        description: body.description,
      },
    })

    return NextResponse.json({
      success: true,
      data: vehicleType,
    })
  } catch (error: any) {
    console.error('Error creating vehicle type:', error)

    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Vehicle type with this name already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create vehicle type' },
      { status: 500 }
    )
  }
}
