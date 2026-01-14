import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { supabase } from '@/lib/supabase';

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
    const extension = file.name.split('.').pop();
    const filename = `${randomUUID()}.${extension}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('vehicle_bucket')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading to Supabase:', uploadError);
      return NextResponse.json({ success: false, error: 'File upload failed', details: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from('vehicle_bucket')
      .getPublicUrl(filename);

    if (!publicUrlData) {
      return NextResponse.json({ success: false, error: 'Could not get public URL' }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: publicUrlData.publicUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: 'File upload failed' }, { status: 500 });
  }
}
