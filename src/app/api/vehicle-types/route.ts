import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const where: any = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    } : {}

    const [vehicleTypes, total] = await Promise.all([
      prisma.vehicleType.findMany({
        where,
        include: {
          vehicles: {
            select: { id: true }
          }
        },
        orderBy: {
          name: 'asc'
        },
        take: limit,
        skip: skip,
      }),
      prisma.vehicleType.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: vehicleTypes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    })
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
        description: body.description
      }
    })

    return NextResponse.json({
      success: true,
      data: vehicleType
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