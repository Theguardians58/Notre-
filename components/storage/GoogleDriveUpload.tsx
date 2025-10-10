'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  uploadToGoogleDrive,
  isSignedInToGoogleDrive,
  DriveFile,
} from '@/lib/storage/google-drive';
import toast from 'react-hot-toast';
import { CloudArrowUpIcon, DocumentIcon } from '@heroicons/react/24/outline';

interface GoogleDriveUploadProps {
  onUploadComplete?: (file: DriveFile) => void;
  acceptedTypes?: string;
  maxSizeMB?: number;
  folderName?: string;
}

export default function GoogleDriveUpload({
  onUploadComplete,
  acceptedTypes = '*',
  maxSizeMB = 100,
  folderName = 'CogniNote',
}: GoogleDriveUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    const sizeMB = file.size / 1024 / 1024;
    if (sizeMB > maxSizeMB) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    if (!isSignedInToGoogleDrive()) {
      toast.error('Please sign in to Google Drive first');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Simulate progress (Google Drive API doesn't provide upload progress)
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const uploadedFile = await uploadToGoogleDrive(selectedFile, folderName);

      clearInterval(progressInterval);
      setProgress(100);

      toast.success(`${selectedFile.name} uploaded successfully!`);
      
      if (onUploadComplete) {
        onUploadComplete(uploadedFile);
      }

      // Reset
      setSelectedFile(null);
      setProgress(0);
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* File Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select File to Upload
        </label>
        <div className="relative">
          <input
            type="file"
            onChange={handleFileSelect}
            accept={acceptedTypes}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              dark:file:bg-blue-900/50 dark:file:text-blue-300
              cursor-pointer"
          />
        </div>
      </div>

      {/* Selected File Info */}
      {selectedFile && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <DocumentIcon className="h-8 w-8 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
              </p>
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>Uploading to Google Drive...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Button */}
      <Button
        onClick={handleUpload}
        disabled={!selectedFile || uploading || !isSignedInToGoogleDrive()}
        className="w-full"
      >
        <CloudArrowUpIcon className="h-5 w-5 mr-2" />
        {uploading ? 'Uploading...' : 'Upload to Google Drive'}
      </Button>

      {/* Instructions */}
      {!isSignedInToGoogleDrive() && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-900 dark:text-yellow-300">
            ⚠️ Please configure and sign in to Google Drive in the setup section above
          </p>
        </div>
      )}
    </div>
  );
}
