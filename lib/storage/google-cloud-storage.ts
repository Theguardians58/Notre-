/**
 * Google Cloud Storage Integration
 * Users can upload media to their own GCS bucket
 */

import { Storage } from '@google-cloud/storage';

export interface GCSConfig {
  projectId: string;
  bucketName: string;
  keyFilename?: string;
  credentials?: {
    client_email: string;
    private_key: string;
  };
}

export interface GCSUploadOptions {
  folder?: string;
  makePublic?: boolean;
  metadata?: Record<string, string>;
}

/**
 * Initialize Google Cloud Storage client
 */
export function initializeGCS(config: GCSConfig): Storage {
  const options: any = {
    projectId: config.projectId,
  };

  if (config.keyFilename) {
    options.keyFilename = config.keyFilename;
  } else if (config.credentials) {
    options.credentials = config.credentials;
  }

  return new Storage(options);
}

/**
 * Upload file to Google Cloud Storage
 */
export async function uploadToGCS(
  storage: Storage,
  bucketName: string,
  file: File | Blob,
  filename: string,
  options?: GCSUploadOptions
): Promise<string> {
  try {
    const bucket = storage.bucket(bucketName);
    
    // Create destination path
    const destination = options?.folder 
      ? `${options.folder}/${filename}` 
      : filename;

    // Convert File/Blob to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload file
    const fileRef = bucket.file(destination);
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type || 'application/octet-stream',
        metadata: options?.metadata || {},
      },
    });

    // Make public if requested
    if (options?.makePublic) {
      await fileRef.makePublic();
    }

    // Return public URL
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
    return publicUrl;
  } catch (error: any) {
    console.error('GCS upload error:', error);
    throw new Error(`Failed to upload to GCS: ${error.message}`);
  }
}

/**
 * Delete file from Google Cloud Storage
 */
export async function deleteFromGCS(
  storage: Storage,
  bucketName: string,
  filename: string
): Promise<void> {
  try {
    const bucket = storage.bucket(bucketName);
    await bucket.file(filename).delete();
  } catch (error: any) {
    console.error('GCS delete error:', error);
    throw new Error(`Failed to delete from GCS: ${error.message}`);
  }
}

/**
 * Get signed URL for private file
 */
export async function getSignedUrl(
  storage: Storage,
  bucketName: string,
  filename: string,
  expiresInMinutes: number = 60
): Promise<string> {
  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filename);

    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + expiresInMinutes * 60 * 1000,
    });

    return url;
  } catch (error: any) {
    console.error('GCS signed URL error:', error);
    throw new Error(`Failed to get signed URL: ${error.message}`);
  }
}

/**
 * List files in bucket
 */
export async function listGCSFiles(
  storage: Storage,
  bucketName: string,
  prefix?: string
): Promise<Array<{ name: string; size: number; updated: Date }>> {
  try {
    const bucket = storage.bucket(bucketName);
    const [files] = await bucket.getFiles({ prefix });

    return files.map(file => ({
      name: file.name,
      size: typeof file.metadata.size === 'number' 
        ? file.metadata.size 
        : parseInt(file.metadata.size || '0'),
      updated: new Date(file.metadata.updated || Date.now()),
    }));
  } catch (error: any) {
    console.error('GCS list files error:', error);
    throw new Error(`Failed to list files: ${error.message}`);
  }
}

/**
 * Check if bucket exists
 */
export async function checkBucketExists(
  storage: Storage,
  bucketName: string
): Promise<boolean> {
  try {
    const bucket = storage.bucket(bucketName);
    const [exists] = await bucket.exists();
    return exists;
  } catch (error) {
    return false;
  }
}

/**
 * Create bucket
 */
export async function createBucket(
  storage: Storage,
  bucketName: string,
  location: string = 'US'
): Promise<void> {
  try {
    await storage.createBucket(bucketName, {
      location,
      storageClass: 'STANDARD',
    });
  } catch (error: any) {
    console.error('GCS create bucket error:', error);
    throw new Error(`Failed to create bucket: ${error.message}`);
  }
}

/**
 * Get bucket metadata
 */
export async function getBucketMetadata(
  storage: Storage,
  bucketName: string
): Promise<any> {
  try {
    const bucket = storage.bucket(bucketName);
    const [metadata] = await bucket.getMetadata();
    return metadata;
  } catch (error: any) {
    console.error('GCS get metadata error:', error);
    throw new Error(`Failed to get bucket metadata: ${error.message}`);
  }
}
