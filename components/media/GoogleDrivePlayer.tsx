'use client';

import { useState, useEffect } from 'react';
import {
  getStreamingUrl,
  getFileDetails,
  DriveFile,
} from '@/lib/storage/google-drive';
import { Button } from '@/components/ui/Button';
import { PlayCircleIcon, ArrowDownTrayIcon, DocumentIcon } from '@heroicons/react/24/outline';

interface GoogleDrivePlayerProps {
  fileId: string;
  autoPlay?: boolean;
}

export default function GoogleDrivePlayer({
  fileId,
  autoPlay = false,
}: GoogleDrivePlayerProps) {
  const [file, setFile] = useState<DriveFile | null>(null);
  const [streamingUrl, setStreamingUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadFile();
  }, [fileId]);

  const loadFile = async () => {
    setLoading(true);
    setError('');

    try {
      // Get file details
      const fileDetails = await getFileDetails(fileId);
      setFile(fileDetails);

      // Get streaming URL
      const url = await getStreamingUrl(fileId);
      setStreamingUrl(url);
    } catch (err: any) {
      setError(err.message || 'Failed to load file');
      console.error('Load Google Drive file error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading from Google Drive...</p>
        </div>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <p className="text-sm text-red-900 dark:text-red-300">
          ⚠️ {error || 'File not found'}
        </p>
      </div>
    );
  }

  // Determine media type and render appropriate player
  const isVideo = file.mimeType.startsWith('video/');
  const isAudio = file.mimeType.startsWith('audio/');
  const isImage = file.mimeType.startsWith('image/');

  return (
    <div className="space-y-4">
      {/* File Info */}
      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-center gap-3">
          <PlayCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {file.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Playing from Google Drive • {(Number(file.size) / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <a
          href={file.webContentLink || file.webViewLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
        </a>
      </div>

      {/* Media Player */}
      {isVideo && (
        <div className="relative rounded-lg overflow-hidden bg-black">
          <video
            src={streamingUrl}
            controls
            autoPlay={autoPlay}
            className="w-full max-h-[500px]"
            preload="metadata"
          >
            Your browser does not support video playback.
          </video>
        </div>
      )}

      {isAudio && (
        <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
          <audio
            src={streamingUrl}
            controls
            autoPlay={autoPlay}
            className="w-full"
            preload="metadata"
          >
            Your browser does not support audio playback.
          </audio>
        </div>
      )}

      {isImage && (
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={streamingUrl}
            alt={file.name}
            className="w-full h-auto max-h-[600px] object-contain"
          />
        </div>
      )}

      {!isVideo && !isAudio && !isImage && (
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            This file type cannot be previewed directly
          </p>
          <a
            href={file.webViewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <PlayCircleIcon className="h-5 w-5" />
            Open in Google Drive
          </a>
        </div>
      )}

      {/* Additional Actions */}
      <div className="flex gap-3">
        <a
          href={file.webViewLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button variant="secondary" className="w-full">
            View in Google Drive
          </Button>
        </a>
        {file.webContentLink && (
          <a
            href={file.webContentLink}
            download
            className="flex-1"
          >
            <Button variant="secondary" className="w-full">
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Download
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
