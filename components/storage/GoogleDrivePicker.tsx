/**
 * Google Drive File Picker
 * Select files from Google Drive to embed in notes
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { 
  FolderIcon,
  MagnifyingGlassIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';
import { listGoogleDriveFiles } from '@/lib/storage/google-drive';

interface GoogleDrivePickerProps {
  onFileSelect: (fileId: string, fileName: string, mimeType: string) => void;
  filterTypes?: string[]; // e.g., ['image/', 'video/']
}

export default function GoogleDrivePicker({
  onFileSelect,
  filterTypes,
}: GoogleDrivePickerProps) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLoadFiles = async () => {
    const savedConfig = localStorage.getItem('googleDriveConfig');
    if (!savedConfig) {
      toast.error('Please configure Google Drive first');
      return;
    }

    const config = JSON.parse(savedConfig);
    if (!config.connected) {
      toast.error('Please connect to Google Drive first');
      return;
    }

    setLoading(true);
    try {
      const driveFiles = await listGoogleDriveFiles(config);
      
      // Filter by type if specified
      let filteredFiles = driveFiles;
      if (filterTypes && filterTypes.length > 0) {
        filteredFiles = driveFiles.filter(file =>
          filterTypes.some(type => file.mimeType.startsWith(type))
        );
      }

      setFiles(filteredFiles);
      toast.success(`Found ${filteredFiles.length} files`);
    } catch (error: any) {
      console.error('Load files error:', error);
      toast.error('Failed to load files from Google Drive');
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎬';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.includes('folder')) return '📁';
    return '📎';
  };

  return (
    <div className="space-y-4">
      {/* Load Button */}
      <Button
        onClick={handleLoadFiles}
        disabled={loading}
        className="w-full"
      >
        <FolderIcon className="h-5 w-5 mr-2" />
        {loading ? 'Loading Files...' : 'Browse Google Drive'}
      </Button>

      {files.length > 0 && (
        <>
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* File List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredFiles.map(file => (
              <button
                key={file.id}
                onClick={() => {
                  onFileSelect(file.id, file.name, file.mimeType);
                  toast.success(`Selected: ${file.name}`);
                }}
                className="w-full text-left p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getFileIcon(file.mimeType)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)} • {new Date(file.modifiedTime).toLocaleDateString()}
                    </p>
                  </div>
                  <DocumentIcon className="h-5 w-5 text-gray-400" />
                </div>
              </button>
            ))}

            {filteredFiles.length === 0 && searchTerm && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No files found matching "{searchTerm}"</p>
              </div>
            )}
          </div>

          {/* File Count */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Showing {filteredFiles.length} of {files.length} files
          </p>
        </>
      )}
    </div>
  );
}
