import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const owners = await prisma.owner.findMany({
      include: {
        vehicles: {
          select: { id: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: owners
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
        picture: body.picture
      }
    })

    return NextResponse.json({
      success: true,
      data: owner
    })
  } catch (error) {
    console.error('Error creating owner:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create owner' },
      { status: 500 }
    )
  }
}