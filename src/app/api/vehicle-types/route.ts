import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const vehicleTypes = await prisma.vehicleType.findMany({
      include: {
        vehicles: {
          select: { id: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: vehicleTypes
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