'use client';

import { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { downloadFileFromUrl } from '@/lib/media/url-parser';

interface VideoPlayerProps {
  url: string;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
}

export default function VideoPlayer({ 
  url, 
  autoPlay = false, 
  controls = true,
  className = '' 
}: VideoPlayerProps) {
  const [error, setError] = useState(false);

  const handleDownload = () => {
    downloadFileFromUrl(url, 'video');
  };

  if (error) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Failed to load video
        </p>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm"
        >
          Open in new tab
        </a>
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <video
        src={url}
        controls={controls}
        autoPlay={autoPlay}
        className="w-full max-h-[600px] rounded-lg bg-black"
        onError={() => setError(true)}
      >
        Your browser does not support the video tag.
      </video>
      
      {/* Download button */}
      <button
        onClick={handleDownload}
        className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
        title="Download video"
      >
        <ArrowDownTrayIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
