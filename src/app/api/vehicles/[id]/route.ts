import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        vehicleType: true,
        driver: true,
        owner: true,
      },
    })

    if (!vehicle) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: vehicle,
    })
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicle' },
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

    const vehicle = await prisma.vehicle.update({
      where: { id: parseInt(params.id) },
      data: {
        vehicleTypeId: body.vehicleTypeId,
        engineNumber: body.engineNumber,
        chassisNumber: body.chassisNumber,
        vehicleLicenseNumber: body.vehicleLicenseNumber,
        vehicleCapacity: body.vehicleCapacity,
        vehicleLocation: body.vehicleLocation,
        serviceArea: body.serviceArea,
        status: body.status,
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
    console.error('Error updating vehicle:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update vehicle' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.vehicle.delete({
      where: { id: parseInt(params.id) },
    })

    return NextResponse.json({
      success: true,
      message: 'Vehicle deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete vehicle' },
      { status: 500 }
    )
  }
}