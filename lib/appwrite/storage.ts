/**
 * Appwrite Storage Operations
 */

import { ID } from 'appwrite';
import { storage, appwrite } from './config';

const { storageBucketId } = appwrite.config;

/**
 * Upload a file to Appwrite Storage
 */
export async function uploadFile(
  file: File | Blob,
  path?: string
): Promise<string> {
  try {
    // Create file ID from path or generate unique
    const fileId = path ? path.replace(/[^a-zA-Z0-9._-]/g, '_') : ID.unique();

    const response = await storage.createFile(
      storageBucketId,
      fileId,
      file
    );

    // Get file URL
    const fileUrl = storage.getFileView(storageBucketId, response.$id);
    return fileUrl.toString();
  } catch (error: any) {
    console.error('Appwrite upload error:', error);
    throw new Error(error.message || 'Failed to upload file');
  }
}

/**
 * Upload image
 */
export async function uploadImage(
  userId: string,
  file: File,
  noteId?: string
): Promise<string> {
  try {
    const timestamp = Date.now();
    const fileName = `${userId}/${noteId || 'images'}/${timestamp}-${file.name}`;
    
    return await uploadFile(file, fileName);
  } catch (error: any) {
    console.error('Appwrite image upload error:', error);
    throw new Error(error.message || 'Failed to upload image');
  }
}

/**
 * Get file URL
 */
export function getFileUrl(fileId: string): string {
  const fileUrl = storage.getFileView(storageBucketId, fileId);
  return fileUrl.toString();
}

/**
 * Get file download URL
 */
export function getFileDownloadUrl(fileId: string): string {
  const downloadUrl = storage.getFileDownload(storageBucketId, fileId);
  return downloadUrl.toString();
}

/**
 * Delete a file
 */
export async function deleteFile(fileId: string): Promise<void> {
  try {
    await storage.deleteFile(storageBucketId, fileId);
  } catch (error: any) {
    console.error('Appwrite delete file error:', error);
    throw new Error(error.message || 'Failed to delete file');
  }
}

/**
 * List files
 */
export async function listFiles(): Promise<any[]> {
  try {
    const response = await storage.listFiles(storageBucketId);
    return response.files;
  } catch (error: any) {
    console.error('Appwrite list files error:', error);
    return [];
  }
}

/**
 * Get file preview (for images)
 */
export function getFilePreview(
  fileId: string,
  width: number = 400,
  height: number = 400
): string {
  const previewUrl = storage.getFilePreview(
    storageBucketId,
    fileId,
    width,
    height
  );
  return previewUrl.toString();
}
