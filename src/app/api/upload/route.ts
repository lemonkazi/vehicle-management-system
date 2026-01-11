import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate a unique filename
    const extension = file.name.split('.').pop()
    const filename = `${randomUUID()}.${extension}`

    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    const path = join(uploadsDir, filename)
    
    await writeFile(path, buffer)

    const publicUrl = `/uploads/${filename}`

    return NextResponse.json({ success: true, url: publicUrl })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ success: false, error: 'File upload failed' }, { status: 500 })
  }
}
