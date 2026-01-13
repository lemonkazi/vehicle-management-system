import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id: params.id },
    })

    if (!driver) {
      return NextResponse.json(
        { success: false, error: 'Driver not found' },
        { status: 404 }
      )
    }

    const vehicles = await prisma.vehicle.findMany({
      where: { driverId: params.id },
    })

    const vehiclesWithDetails = await Promise.all(
      vehicles.map(async (vehicle) => {
        const vehicleType = vehicle.vehicleTypeId
          ? await prisma.vehicleType.findUnique({
              where: { id: vehicle.vehicleTypeId },
            })
          : null
        return { ...vehicle, vehicleType }
      })
    )

    return NextResponse.json({
      success: true,
      data: { ...driver, vehicles: vehiclesWithDetails },
    })
  } catch (error) {
    console.error('Error fetching driver:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch driver' },
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

    const driver = await prisma.driver.update({
      where: { id: params.id },
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
    console.error('Error updating driver:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update driver' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.driver.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Driver deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting driver:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete driver' },
      { status: 500 }
    )
  }
}
