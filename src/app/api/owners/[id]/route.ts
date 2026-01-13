import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const owner = await prisma.owner.findUnique({
      where: { id: params.id },
    })

    if (!owner) {
      return NextResponse.json(
        { success: false, error: 'Owner not found' },
        { status: 404 }
      )
    }

    const vehicles = await prisma.vehicle.findMany({
      where: { ownerId: params.id },
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
      data: { ...owner, vehicles: vehiclesWithDetails },
    })
  } catch (error) {
    console.error('Error fetching owner:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch owner' },
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

    const owner = await prisma.owner.update({
      where: { id: params.id },
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
    console.error('Error updating owner:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update owner' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.owner.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Owner deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting owner:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete owner' },
      { status: 500 }
    )
  }
}
