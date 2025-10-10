/**
 * Supabase Storage Operations
 */

import { supabase } from './config';

const STORAGE_BUCKET = 'cogninote-files';

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  file: File | Blob,
  path?: string
): Promise<string> {
  try {
    const fileName = path || `uploads/${Date.now()}-${file instanceof File ? file.name : 'file'}`;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error: any) {
    console.error('Supabase upload error:', error);
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
    const fileName = `${timestamp}-${file.name}`;
    const path = noteId
      ? `users/${userId}/notes/${noteId}/images/${fileName}`
      : `users/${userId}/images/${fileName}`;

    return await uploadFile(file, path);
  } catch (error: any) {
    console.error('Supabase image upload error:', error);
    throw new Error(error.message || 'Failed to upload image');
  }
}

/**
 * Get file URL
 */
export function getFileUrl(filePath: string): string {
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Get file download URL (signed URL for private files)
 */
export async function getFileDownloadUrl(
  filePath: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(filePath, expiresIn);

    if (error) throw error;

    return data.signedUrl;
  } catch (error: any) {
    console.error('Supabase get download URL error:', error);
    throw new Error(error.message || 'Failed to get download URL');
  }
}

/**
 * Delete a file
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) throw error;
  } catch (error: any) {
    console.error('Supabase delete file error:', error);
    throw new Error(error.message || 'Failed to delete file');
  }
}

/**
 * List files
 */
export async function listFiles(
  path: string = ''
): Promise<Array<{ name: string; size: number; updated: Date }>> {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(path);

    if (error) throw error;

    return data.map(file => ({
      name: file.name,
      size: file.metadata?.size || 0,
      updated: new Date(file.updated_at || Date.now()),
    }));
  } catch (error: any) {
    console.error('Supabase list files error:', error);
    return [];
  }
}

/**
 * Get file preview (for images)
 */
export function getFilePreview(
  filePath: string,
  width: number = 400,
  height: number = 400
): string {
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath, {
      transform: {
        width,
        height,
        resize: 'contain',
      },
    });

  return publicUrl;
}
