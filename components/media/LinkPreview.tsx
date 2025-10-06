'use client';

import { useState, useEffect } from 'react';
import { LinkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface LinkPreviewProps {
  url: string;
  className?: string;
}

export default function LinkPreview({ url, className = '' }: LinkPreviewProps) {
  const [favicon, setFavicon] = useState<string | null>(null);

  useEffect(() => {
    // Extract domain for favicon
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      setFavicon(`https://www.google.com/s2/favicons?domain=${domain}&sz=32`);
    } catch (error) {
      setFavicon(null);
    }
  }, [url]);

  const displayUrl = url.length > 60 ? url.substring(0, 60) + '...' : url;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${className}`}
    >
      <div className="flex items-start gap-3">
        {favicon ? (
          <img src={favicon} alt="" className="w-6 h-6 mt-0.5 flex-shrink-0" />
        ) : (
          <LinkIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">
              {displayUrl}
            </p>
            <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Click to open in new tab
          </p>
        </div>
      </div>
    </a>
  );
}
