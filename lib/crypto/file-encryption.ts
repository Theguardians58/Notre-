/**
 * File Encryption Utilities
 * Provides encryption/decryption for file attachments
 */

import { generateIV } from './encryption';

export interface EncryptedFileMetadata {
  originalName: string;
  mimeType: string;
  size: number;
  encryptedSize: number;
  iv: number[];
  timestamp: number;
}

export interface EncryptedFile {
  encryptedData: Blob;
  metadata: EncryptedFileMetadata;
}

/**
 * Encrypt a file using the user's encryption key
 */
export async function encryptFile(
  file: File,
  encryptionKey: CryptoKey
): Promise<EncryptedFile> {
  try {
    // Read file as ArrayBuffer
    const fileData = await file.arrayBuffer();

    // Generate IV for this file
    const iv = generateIV();

    // Encrypt file data
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(iv),
      },
      encryptionKey,
      fileData
    );

    // Create metadata
    const metadata: EncryptedFileMetadata = {
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      encryptedSize: encryptedData.byteLength,
      iv: Array.from(iv),
      timestamp: Date.now(),
    };

    // Convert encrypted data to Blob
    const encryptedBlob = new Blob([encryptedData], { type: 'application/octet-stream' });

    return {
      encryptedData: encryptedBlob,
      metadata,
    };
  } catch (error) {
    console.error('File encryption failed:', error);
    throw new Error('Failed to encrypt file');
  }
}

/**
 * Decrypt an encrypted file
 */
export async function decryptFile(
  encryptedBlob: Blob,
  metadata: EncryptedFileMetadata,
  encryptionKey: CryptoKey
): Promise<File> {
  try {
    // Read encrypted blob as ArrayBuffer
    const encryptedData = await encryptedBlob.arrayBuffer();

    // Decrypt file data
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(metadata.iv),
      },
      encryptionKey,
      encryptedData
    );

    // Create File object with original metadata
    const file = new File([decryptedData], metadata.originalName, {
      type: metadata.mimeType,
    });

    return file;
  } catch (error) {
    console.error('File decryption failed:', error);
    throw new Error('Failed to decrypt file');
  }
}

/**
 * Encrypt multiple files
 */
export async function encryptFiles(
  files: File[],
  encryptionKey: CryptoKey,
  onProgress?: (current: number, total: number) => void
): Promise<EncryptedFile[]> {
  const encryptedFiles: EncryptedFile[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file) continue;
    const encryptedFile = await encryptFile(file, encryptionKey);
    encryptedFiles.push(encryptedFile);

    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }

  return encryptedFiles;
}

/**
 * Decrypt multiple files
 */
export async function decryptFiles(
  encryptedFiles: { blob: Blob; metadata: EncryptedFileMetadata }[],
  encryptionKey: CryptoKey,
  onProgress?: (current: number, total: number) => void
): Promise<File[]> {
  const decryptedFiles: File[] = [];

  for (let i = 0; i < encryptedFiles.length; i++) {
    const item = encryptedFiles[i];
    if (!item) continue;
    const { blob, metadata } = item;
    const decryptedFile = await decryptFile(blob, metadata, encryptionKey);
    decryptedFiles.push(decryptedFile);

    if (onProgress) {
      onProgress(i + 1, encryptedFiles.length);
    }
  }

  return decryptedFiles;
}

/**
 * Encrypt file in chunks for large files
 */
export async function encryptLargeFile(
  file: File,
  encryptionKey: CryptoKey,
  chunkSize: number = 1024 * 1024, // 1 MB chunks
  onProgress?: (percent: number) => void
): Promise<EncryptedFile> {
  try {
    const chunks: ArrayBuffer[] = [];
    const iv = generateIV();
    let offset = 0;

    // Read and encrypt file in chunks
    while (offset < file.size) {
      const chunk = file.slice(offset, offset + chunkSize);
      const chunkData = await chunk.arrayBuffer();

      const encryptedChunk = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: new Uint8Array(iv),
          additionalData: new TextEncoder().encode(`chunk-${offset}`),
        },
        encryptionKey,
        chunkData
      );

      chunks.push(encryptedChunk);
      offset += chunkSize;

      if (onProgress) {
        onProgress(Math.min((offset / file.size) * 100, 100));
      }
    }

    // Combine all chunks
    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
    const combinedData = new Uint8Array(totalSize);
    let position = 0;

    for (const chunk of chunks) {
      combinedData.set(new Uint8Array(chunk), position);
      position += chunk.byteLength;
    }

    const metadata: EncryptedFileMetadata = {
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      encryptedSize: totalSize,
      iv: Array.from(iv),
      timestamp: Date.now(),
    };

    const encryptedBlob = new Blob([combinedData], { type: 'application/octet-stream' });

    return {
      encryptedData: encryptedBlob,
      metadata,
    };
  } catch (error) {
    console.error('Large file encryption failed:', error);
    throw new Error('Failed to encrypt large file');
  }
}

/**
 * Generate a download link for an encrypted file
 */
export function createEncryptedFileDownload(encryptedFile: EncryptedFile): string {
  const url = URL.createObjectURL(encryptedFile.encryptedData);
  return url;
}

/**
 * Validate file before encryption
 */
export function validateFile(file: File, maxSize: number = 100 * 1024 * 1024): boolean {
  // Max 100 MB by default
  if (file.size > maxSize) {
    throw new Error(`File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)} MB`);
  }

  // Check for valid file type (basic validation)
  if (!file.type) {
    console.warn('File has no MIME type');
  }

  return true;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
