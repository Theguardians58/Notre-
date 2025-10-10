'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import {
  listGoogleDriveFiles,
  deleteFromGoogleDrive,
  DriveFile,
  isSignedInToGoogleDrive,
} from '@/lib/storage/google-drive';
import toast from 'react-hot-toast';
import {
  FolderIcon,
  DocumentIcon,
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon,
  TrashIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface GoogleDriveFilePickerProps {
  onFileSelect?: (file: DriveFile) => void;
  folderName?: string;
}

export default function GoogleDriveFilePicker({
  onFileSelect,
  folderName = 'CogniNote',
}: GoogleDriveFilePickerProps) {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);

  useEffect(() => {
    if (isSignedInToGoogleDrive()) {
      loadFiles();
    }
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const driveFiles = await listGoogleDriveFiles(folderName);
      setFiles(driveFiles);
    } catch (error) {
      toast.error('Failed to load files from Google Drive');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!confirm(`Delete "${fileName}" from Google Drive?`)) {
      return;
    }

    try {
      await deleteFromGoogleDrive(fileId);
      toast.success('File deleted');
      loadFiles();
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  const handleFileClick = (file: DriveFile) => {
    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return PhotoIcon;
    if (mimeType.startsWith('video/')) return FilmIcon;
    if (mimeType.startsWith('audio/')) return MusicalNoteIcon;
    return DocumentIcon;
  };

  if (!isSignedInToGoogleDrive()) {
    return (
      <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 text-center">
        <p className="text-sm text-yellow-900 dark:text-yellow-300">
          Please sign in to Google Drive to view your files
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Google Drive Files
          </h3>
        </div>
        <Button
          onClick={loadFiles}
          disabled={loading}
          variant="secondary"
          size="sm"
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Files List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading files...</p>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No files in your CogniNote folder yet
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Upload files using the upload section above
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
          {files.map((file) => {
            const Icon = getFileIcon(file.mimeType);
            const isSelected = selectedFile?.id === file.id;

            return (
              <div
                key={file.id}
                onClick={() => handleFileClick(file)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-8 w-8 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(Number(file.size) / 1024 / 1024).toFixed(2)} MB •{' '}
                      {new Date(file.createdTime).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(file.id, file.name);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Show thumbnail for images */}
                {file.thumbnailLink && (
                  <img
                    src={file.thumbnailLink}
                    alt={file.name}
                    className="mt-3 rounded w-full h-32 object-cover"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
