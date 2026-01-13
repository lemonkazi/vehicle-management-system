import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
    })

    if (!vehicle) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found' },
        { status: 404 }
      )
    }

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

    const vehicle = await prisma.vehicle.update({
      where: { id: params.id },
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
    console.error('Error updating vehicle:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update vehicle' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      )
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data: {
        status: status,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedVehicle,
    })
  } catch (error) {
    console.error('Error updating vehicle status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update vehicle status' },
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
      where: { id: params.id },
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
