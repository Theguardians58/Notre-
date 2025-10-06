'use client';

import { useState } from 'react';
import { ArrowDownTrayIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { downloadFileFromUrl } from '@/lib/media/url-parser';
import { Button } from '@/components/ui/Button';

interface PDFViewerProps {
  url: string;
  className?: string;
  height?: number;
}

export default function PDFViewer({ url, className = '', height = 600 }: PDFViewerProps) {
  const [viewMode, setViewMode] = useState<'embed' | 'link'>('embed');

  const handleDownload = () => {
    downloadFileFromUrl(url, 'document.pdf');
  };

  const handleOpenNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden ${className}`}>
      {/* Controls */}
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-300 dark:border-gray-600">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
          </svg>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            PDF Document
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'embed' ? 'link' : 'embed')}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            {viewMode === 'embed' ? 'Show link' : 'Show embed'}
          </button>
          <Button variant="ghost" size="sm" onClick={handleOpenNewTab}>
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <ArrowDownTrayIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Embed or Link */}
      {viewMode === 'embed' ? (
        <iframe
          src={url}
          className="w-full bg-white"
          style={{ height: `${height}px` }}
          title="PDF Viewer"
        />
      ) : (
        <div className="p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            PDF preview not available
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={handleOpenNewTab} variant="primary">
              <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button onClick={handleDownload} variant="outline">
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
