'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  ArrowDownTrayIcon, 
  ArrowsPointingOutIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { downloadFileFromUrl } from '@/lib/media/url-parser';
import { Button } from '@/components/ui/Button';

interface ImageViewerProps {
  url: string;
  alt?: string;
  className?: string;
}

export default function ImageViewer({ url, alt, className = '' }: ImageViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleDownload = () => {
    downloadFileFromUrl(url, alt || 'image');
  };

  return (
    <>
      <div className={`relative group ${className}`}>
        <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
          <img
            src={url}
            alt={alt || 'Image'}
            className="w-full h-auto max-h-[600px] object-contain"
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
          />
          
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <p className="text-gray-500 dark:text-gray-400">Failed to load image</p>
            </div>
          )}
          
          {/* Overlay controls */}
          {!loading && !error && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button
                onClick={() => setIsFullscreen(true)}
                className="p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white"
                title="View fullscreen"
              >
                <ArrowsPointingOutIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white"
                title="Download"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        
        {alt && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
            {alt}
          </p>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
            onClick={() => setIsFullscreen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          
          <img
            src={url}
            alt={alt || 'Image'}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
