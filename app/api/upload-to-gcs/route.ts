/**
 * API Route for uploading files to Google Cloud Storage
 * Server-side implementation for secure GCS operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    const bucketName = formData.get('bucketName') as string;
    const credentials = formData.get('credentials') as string;

    if (!file || !projectId || !bucketName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize Storage client
    let storageOptions: any = { projectId };
    
    if (credentials) {
      try {
        storageOptions.credentials = JSON.parse(credentials);
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid credentials format' },
          { status: 400 }
        );
      }
    }

    const storage = new Storage(storageOptions);
    const bucket = storage.bucket(bucketName);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to GCS
    const fileRef = bucket.file(filename);
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });

    // Make file publicly accessible
    await fileRef.makePublic();

    // Generate public URL
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
    });
  } catch (error: any) {
    console.error('GCS upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Configure for larger file uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};
