/**
 * Google Drive Media Player
 * Fetch and play media files directly from Google Drive
 */

'use client';

import { useState, useEffect } from 'react';
import { getGoogleDriveDirectUrl, getGoogleDrivePreviewUrl, getFileFromDrive } from '@/lib/storage/google-drive';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  DocumentIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/outline';

interface GoogleDrivePlayerProps {
  fileId: string;
  fileName?: string;
  mimeType?: string;
  showControls?: boolean;
}

export default function GoogleDrivePlayer({
  fileId,
  fileName: initialFileName,
  mimeType: initialMimeType,
  showControls = true,
}: GoogleDrivePlayerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState(initialFileName);
  const [mimeType, setMimeType] = useState(initialMimeType);

  useEffect(() => {
    // Fetch file metadata if not provided
    if (!fileName || !mimeType) {
      fetchFileMetadata();
    } else {
      setLoading(false);
    }
  }, [fileId]);

  const fetchFileMetadata = async () => {
    try {
      const savedConfig = localStorage.getItem('googleDriveConfig');
      if (!savedConfig) {
        throw new Error('Google Drive not configured');
      }

      const config = JSON.parse(savedConfig);
      const file = await getFileFromDrive(fileId, config);
      
      setFileName(file.name);
      setMimeType(file.mimeType);
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to fetch file metadata:', err);
      setError(err.message || 'Failed to load file');
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.open(getGoogleDriveDirectUrl(fileId), '_blank');
  };

  const handleOpenInDrive = () => {
    window.open(`https://drive.google.com/file/d/${fileId}/view`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading from Google Drive...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <p className="text-red-800 dark:text-red-200 font-medium">Failed to load file</p>
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="secondary"
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  const renderMedia = () => {
    const directUrl = getGoogleDriveDirectUrl(fileId);
    const previewUrl = getGoogleDrivePreviewUrl(fileId);

    // Images
    if (mimeType?.startsWith('image/')) {
      return (
        <div className="relative">
          <img
            src={directUrl}
            alt={fileName || 'Image from Google Drive'}
            className="w-full h-auto rounded-lg"
            onError={() => setError('Failed to load image')}
          />
        </div>
      );
    }

    // Videos
    if (mimeType?.startsWith('video/')) {
      return (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src={previewUrl}
            className="w-full h-full"
            allow="autoplay"
            title={fileName || 'Video from Google Drive'}
          />
        </div>
      );
    }

    // Audio
    if (mimeType?.startsWith('audio/')) {
      return (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <MusicalNoteIcon className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">
                {fileName || 'Audio File'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                From Google Drive
              </p>
            </div>
          </div>
          <audio
            src={directUrl}
            controls
            className="w-full"
            onError={() => setError('Failed to load audio')}
          />
        </div>
      );
    }

    // PDFs
    if (mimeType === 'application/pdf') {
      return (
        <div className="relative aspect-[8.5/11] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <iframe
            src={previewUrl}
            className="w-full h-full"
            title={fileName || 'PDF from Google Drive'}
          />
        </div>
      );
    }

    // Other files - show preview link
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <DocumentIcon className="h-12 w-12 text-gray-400" />
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white">
              {fileName || 'File from Google Drive'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {mimeType || 'Unknown type'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Media Player */}
      <div className="rounded-lg overflow-hidden">
        {renderMedia()}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex gap-2">
          <Button
            onClick={handleDownload}
            variant="secondary"
            size="sm"
            className="flex-1"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            onClick={handleOpenInDrive}
            variant="secondary"
            size="sm"
            className="flex-1"
          >
            <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
            Open in Drive
          </Button>
        </div>
      )}

      {/* File Info */}
      {fileName && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>📁 {fileName}</p>
          <p>🔗 File ID: {fileId}</p>
          {mimeType && <p>📎 Type: {mimeType}</p>}
        </div>
      )}
    </div>
  );
}
