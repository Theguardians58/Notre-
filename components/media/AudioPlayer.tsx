'use client';

import { useState } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon,
  ArrowDownTrayIcon 
} from '@heroicons/react/24/outline';
import { downloadFileFromUrl } from '@/lib/media/url-parser';

interface AudioPlayerProps {
  url: string;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
  title?: string;
}

export default function AudioPlayer({ 
  url, 
  autoPlay = false, 
  controls = true,
  className = '',
  title
}: AudioPlayerProps) {
  const [error, setError] = useState(false);

  const handleDownload = () => {
    downloadFileFromUrl(url, title || 'audio');
  };

  if (error) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Failed to load audio
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 ${className}`}>
      {title && (
        <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <SpeakerWaveIcon className="h-5 w-5 text-blue-600" />
          {title}
        </h4>
      )}
      
      <div className="flex items-center gap-3">
        <audio
          src={url}
          controls={controls}
          autoPlay={autoPlay}
          className="flex-1"
          onError={() => setError(true)}
        >
          Your browser does not support the audio tag.
        </audio>
        
        <button
          onClick={handleDownload}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
          title="Download audio"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
