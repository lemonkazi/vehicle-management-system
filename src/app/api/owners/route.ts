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
            { nidNumber: { contains: search } },
          ],
        }
      : {}

    const [owners, total] = await Promise.all([
      prisma.owner.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: skip,
      }),
      prisma.owner.count({ where }),
    ])

    const ownersWithVehicleCount = await Promise.all(
      owners.map(async (owner) => {
        const vehicleCount = await prisma.vehicle.count({
          where: { ownerId: owner.id },
        })
        return { ...owner, _count: { vehicles: vehicleCount } }
      })
    )

    return NextResponse.json({
      success: true,
      data: ownersWithVehicleCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching owners:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch owners' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const owner = await prisma.owner.create({
      data: {
        name: body.name,
        contractNumber: body.contractNumber,
        nidNumber: body.nidNumber,
        districtName: body.districtName,
        presentAddress: body.presentAddress,
        permanentAddress: body.permanentAddress,
        picture: body.picture,
      },
    })

    return NextResponse.json({
      success: true,
      data: owner,
    })
  } catch (error) {
    console.error('Error creating owner:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create owner' },
      { status: 500 }
    )
  }
}
