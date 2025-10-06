'use client';

import { MediaInfo } from '@/lib/media/url-parser';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface EmbedPlayerProps {
  mediaInfo: MediaInfo;
  className?: string;
}

export default function EmbedPlayer({ mediaInfo, className = '' }: EmbedPlayerProps) {
  const { embedUrl, type, provider, thumbnail } = mediaInfo;

  if (!embedUrl) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Cannot embed this content
        </p>
        <a 
          href={mediaInfo.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm flex items-center gap-1 mt-2"
        >
          Open in {provider || 'new tab'}
          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
        </a>
      </div>
    );
  }

  // Get aspect ratio based on type
  const aspectRatio = type === 'spotify' ? 'aspect-[1/1]' : 'aspect-video';

  return (
    <div className={`relative ${className}`}>
      <div className={`relative ${aspectRatio} rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800`}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={`${provider} embed`}
        />
      </div>
      
      {/* Provider badge */}
      {provider && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            via {provider}
          </span>
          <a
            href={mediaInfo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1"
          >
            Open original
            <ArrowTopRightOnSquareIcon className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  );
}
