import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

async function getOwner(request: NextRequest, id: number) {
  try {
    const owner = await prisma.owner.findUnique({
      where: { id },
      include: {
        vehicles: {
          include: {
            vehicleType: true
          }
        }
      }
    })

    if (!owner) {
      return NextResponse.json(
        { success: false, error: 'Owner not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: owner
    })
  } catch (error) {
    console.error(`Error fetching owner ${id}:`, error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch owner' },
      { status: 500 }
    )
  }
}

async function updateOwner(request: NextRequest, id: number) {
  try {
    const body = await request.json()

    const updatedOwner = await prisma.owner.update({
      where: { id },
      data: {
        name: body.name,
        contractNumber: body.contractNumber,
        nidNumber: body.nidNumber,
        districtName: body.districtName,
        presentAddress: body.presentAddress,
        permanentAddress: body.permanentAddress,
        picture: body.picture
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedOwner
    })
  } catch (error: any) {
    console.error(`Error updating owner ${id}:`, error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Owner not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update owner' },
      { status: 500 }
    )
  }
}

async function deleteOwner(request: NextRequest, id: number) {
  try {
    await prisma.owner.delete({
      where: { id }
    })

    return new Response(null, { status: 204 })
  } catch (error: any) {
    console.error(`Error deleting owner ${id}:`, error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Owner not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to delete owner' },
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
  return await getOwner(request, id)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10)

  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 })
  }
  return await updateOwner(request, id)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10)

  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 })
  }
  return await deleteOwner(request, id)
}
