import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

async function getDriver(request: NextRequest, id: number) {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id },
      include: {
        vehicles: true
      }
    })

    if (!driver) {
      return NextResponse.json(
        { success: false, error: 'Driver not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: driver
    })
  } catch (error) {
    console.error(`Error fetching driver ${id}:`, error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch driver' },
      { status: 500 }
    )
  }
}


async function updateDriver(request: NextRequest, id: number) {
  try {
    const body = await request.json()

    const updatedDriver = await prisma.driver.update({
      where: { id },
      data: {
        name: body.name,
        contractNumber: body.contractNumber,
        nidNumber: body.nidNumber,
        districtName: body.districtName,
        presentAddress: body.presentAddress,
        permanentAddress: body.permanentAddress,
        drivingLicenseNumber: body.drivingLicenseNumber,
        experienceDuration: body.experienceDuration,
        picture: body.picture
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedDriver
    })
  } catch (error: any) {
    console.error(`Error updating driver ${id}:`, error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Driver not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update driver' },
      { status: 500 }
    )
  }
}

async function deleteDriver(request: NextRequest, id: number) {
  try {
    await prisma.driver.delete({
      where: { id }
    })

    return new Response(null, { status: 204 })
  } catch (error: any) {
    console.error(`Error deleting driver ${id}:`, error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Driver not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to delete driver' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10)

  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 })
  }
  return await getDriver(request, id)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10)

  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 })
  }
  return await updateDriver(request, id)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10)

  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 })
  }
  return await deleteDriver(request, id)
}
