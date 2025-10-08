'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { 
  CloudArrowUpIcon, 
  PhotoIcon,
  VideoCameraIcon,
  DocumentIcon,
  CheckCircleIcon,
  XCircleIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface GCSUploadProps {
  onUploadComplete?: (url: string, filename: string) => void;
  acceptedTypes?: string;
  maxSizeMB?: number;
}

export default function GCSUpload({ 
  onUploadComplete, 
  acceptedTypes = '*',
  maxSizeMB = 100 
}: GCSUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Check if GCS is configured
    const gcsConfig = localStorage.getItem('gcs_config');
    if (!gcsConfig) {
      toast.error('Please configure Google Cloud Storage first');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const config = JSON.parse(gcsConfig);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      // In a real implementation, this would call your backend API
      // which uploads to GCS using the server-side SDK
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', config.projectId);
      formData.append('bucketName', config.bucketName);

      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/upload-to-gcs', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const url = data.url || `https://storage.googleapis.com/${config.bucketName}/${file.name}`;

      setProgress(100);
      setUploadedUrl(url);
      toast.success('File uploaded successfully!');

      if (onUploadComplete) {
        onUploadComplete(url, file.name);
      }

      // Reset after 2 seconds
      setTimeout(() => {
        setProgress(0);
        setUploadedUrl(null);
      }, 2000);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  function getFileIcon() {
    if (acceptedTypes.includes('image')) {
      return <PhotoIcon className="h-8 w-8" />;
    } else if (acceptedTypes.includes('video')) {
      return <VideoCameraIcon className="h-8 w-8" />;
    } else {
      return <DocumentIcon className="h-8 w-8" />;
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div 
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        <div className="flex flex-col items-center gap-3">
          <div className="text-gray-400 dark:text-gray-500">
            {uploading ? (
              <CloudArrowUpIcon className="h-12 w-12 animate-bounce text-blue-500" />
            ) : (
              getFileIcon()
            )}
          </div>

          {uploading ? (
            <div className="w-full max-w-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Uploading...
                </span>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : uploadedUrl ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircleIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Upload complete!</span>
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Click to upload to Google Cloud Storage
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  or drag and drop
                </p>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {acceptedTypes === '*' ? 'Any file type' : acceptedTypes} up to {maxSizeMB}MB
              </p>
            </>
          )}
        </div>
      </div>

      {/* Upload Button */}
      {!uploading && !uploadedUrl && (
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <CloudArrowUpIcon className="h-4 w-4 mr-2" />
          Browse Files
        </Button>
      )}

      {/* Info */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Files are uploaded to your Google Cloud Storage bucket
      </p>
    </div>
  );
}
