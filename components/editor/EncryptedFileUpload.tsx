'use client';

import { useState, useRef } from 'react';
import { encryptFile, formatFileSize, validateFile } from '@/lib/crypto/file-encryption';
import { useEncryptionStore } from '@/lib/store/useEncryptionStore';
import { uploadFile } from '@/lib/firebase/storage';
import { Button } from '@/components/ui/Button';
import { 
  ArrowUpTrayIcon, 
  DocumentIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  LockClosedIcon 
} from '@heroicons/react/24/outline';

interface EncryptedFileUploadProps {
  noteId: string;
  onFileUploaded?: (url: string, metadata: any) => void;
  maxSize?: number;
}

export default function EncryptedFileUpload({ 
  noteId, 
  onFileUploaded, 
  maxSize = 100 * 1024 * 1024 
}: EncryptedFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { encryptionKey, isUnlocked } = useEncryptionStore();

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateFile(file, maxSize);
      setSelectedFile(file);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setSelectedFile(null);
    }
  }

  async function handleUpload() {
    if (!selectedFile || !encryptionKey || !isUnlocked) {
      setError('Cannot upload: encryption not available');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Encrypt file
      setProgress(25);
      const encryptedFile = await encryptFile(selectedFile, encryptionKey);

      // Upload encrypted file to Firebase Storage
      setProgress(50);
      const uploadPath = `encrypted-files/${noteId}/${Date.now()}_${selectedFile.name}.enc`;
      const fileUrl = await uploadFile(encryptedFile.encryptedData, uploadPath);

      setProgress(75);

      // Store metadata separately (you may want to store this in Firestore)
      const fileMetadata = {
        url: fileUrl,
        encrypted: true,
        ...encryptedFile.metadata,
      };

      setProgress(100);

      if (onFileUploaded) {
        onFileUploaded(fileUrl, fileMetadata);
      }

      // Reset
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  if (!isUnlocked) {
    return (
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <LockClosedIcon className="h-5 w-5" />
          <p className="text-sm">Unlock encryption to upload files</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* File Input */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
        <div className="text-center">
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Select a file
              </span>
              <input
                ref={fileInputRef}
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Files will be encrypted before upload (max {formatFileSize(maxSize)})
            </p>
          </div>
        </div>
      </div>

      {/* Selected File Info */}
      {selectedFile && (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
              <LockClosedIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(selectedFile.size)} • Will be encrypted
              </p>
            </div>
          </div>
          <Button
            onClick={handleUpload}
            disabled={uploading}
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowUpTrayIcon className="h-4 w-4" />
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Encrypting and uploading...</span>
            <span className="text-gray-900 dark:text-white font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Info */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <LockClosedIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 dark:text-blue-200">
          <p className="font-medium">End-to-end encrypted</p>
          <p className="text-xs mt-1">
            Files are encrypted on your device before upload. Only you can decrypt them with your encryption key.
          </p>
        </div>
      </div>
    </div>
  );
}
