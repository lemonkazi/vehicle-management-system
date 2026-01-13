import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const where: any = search
      ? {
          OR: [
            { name: { contains: search } },
            { contractNumber: { contains: search } },
            { drivingLicenseNumber: { contains: search } },
          ],
        }
      : {}

    const [drivers, total] = await Promise.all([
      prisma.driver.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: skip,
      }),
      prisma.driver.count({ where }),
    ])

    const driversWithVehicleCount = await Promise.all(
      drivers.map(async (driver) => {
        const vehicleCount = await prisma.vehicle.count({
          where: { driverId: driver.id },
        })
        return { ...driver, _count: { vehicles: vehicleCount } }
      })
    )

    return NextResponse.json({
      success: true,
      data: driversWithVehicleCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching drivers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch drivers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const driver = await prisma.driver.create({
      data: {
        name: body.name,
        contractNumber: body.contractNumber,
        nidNumber: body.nidNumber,
        districtName: body.districtName,
        presentAddress: body.presentAddress,
        permanentAddress: body.permanentAddress,
        drivingLicenseNumber: body.drivingLicenseNumber,
        experienceDuration: body.experienceDuration,
        picture: body.picture,
      },
    })

    return NextResponse.json({
      success: true,
      data: driver,
    })
  } catch (error) {
    console.error('Error creating driver:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create driver' },
      { status: 500 }
    )
  }
}
