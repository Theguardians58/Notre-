'use client';

import { useState, useEffect } from 'react';
import { MediaInfo, parseMediaUrl } from '@/lib/media/url-parser';
import ImageViewer from './ImageViewer';
import VideoPlayer from './VideoPlayer';
import AudioPlayer from './AudioPlayer';
import PDFViewer from './PDFViewer';
import EmbedPlayer from './EmbedPlayer';
import LinkPreview from './LinkPreview';
import { Spinner } from '@/components/ui/Spinner';

interface MediaViewerProps {
  url: string;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
}

export default function MediaViewer({ 
  url, 
  autoPlay = false, 
  controls = true,
  className = '' 
}: MediaViewerProps) {
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMedia();
  }, [url]);

  async function loadMedia() {
    setLoading(true);
    setError(null);

    try {
      const info = await parseMediaUrl(url);
      setMediaInfo(info);
    } catch (err: any) {
      setError(err.message || 'Failed to load media');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (error || !mediaInfo) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-sm text-red-600 dark:text-red-400">
          {error || 'Failed to load media'}
        </p>
      </div>
    );
  }

  // Render appropriate viewer based on media type
  switch (mediaInfo.type) {
    case 'image':
      return <ImageViewer url={url} className={className} />;
    
    case 'video':
      return <VideoPlayer url={url} autoPlay={autoPlay} controls={controls} className={className} />;
    
    case 'audio':
      return <AudioPlayer url={url} autoPlay={autoPlay} controls={controls} className={className} />;
    
    case 'pdf':
      return <PDFViewer url={url} className={className} />;
    
    case 'youtube':
    case 'vimeo':
    case 'spotify':
    case 'soundcloud':
      return <EmbedPlayer mediaInfo={mediaInfo} className={className} />;
    
    case 'document':
    case 'link':
    default:
      return <LinkPreview url={url} className={className} />;
  }
}
