import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vehicleType = await prisma.vehicleType.findUnique({
      where: { id: params.id },
    })

    if (!vehicleType) {
      return NextResponse.json(
        { success: false, error: 'Vehicle type not found' },
        { status: 404 }
      )
    }

    const vehicles = await prisma.vehicle.findMany({
      where: { vehicleTypeId: params.id },
    })

    return NextResponse.json({
      success: true,
      data: { ...vehicleType, vehicles },
    })
  } catch (error) {
    console.error('Error fetching vehicle type:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicle type' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Vehicle type name is required' },
        { status: 400 }
      )
    }

    const updatedVehicleType = await prisma.vehicleType.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedVehicleType,
    })
  } catch (error: any) {
    console.error(`Error updating vehicle type ${params.id}:`, error)

    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Vehicle type with this name already exists' },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Vehicle type not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update vehicle type' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if any vehicles are associated with this type
    const associatedVehicles = await prisma.vehicle.count({
      where: { vehicleTypeId: params.id },
    })

    if (associatedVehicles > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete type, it is associated with vehicles',
        },
        { status: 400 }
      )
    }

    await prisma.vehicleType.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`Error deleting vehicle type ${params.id}:`, error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Vehicle type not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete vehicle type' },
      { status: 500 }
    )
  }
}
