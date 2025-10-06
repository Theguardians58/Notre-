'use client';

import { useState } from 'react';
import { fetchFileFromUrl, parseMediaUrl, getMimeType } from '@/lib/media/url-parser';
import { uploadFile } from '@/lib/firebase/storage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  LinkIcon, 
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon 
} from '@heroicons/react/24/outline';

interface MediaUploadFromUrlProps {
  onMediaAdded?: (url: string, type: string) => void;
}

export default function MediaUploadFromUrl({ onMediaAdded }: MediaUploadFromUrlProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleFetchAndUpload() {
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);
    setProgress('Analyzing URL...');

    try {
      // Parse media info
      const mediaInfo = await parseMediaUrl(url);
      setProgress(`Detected: ${mediaInfo.type}`);

      // For embeddable content (YouTube, etc.), just use the URL
      if (['youtube', 'vimeo', 'spotify', 'soundcloud'].includes(mediaInfo.type)) {
        setProgress('Embed URL ready');
        if (onMediaAdded) {
          onMediaAdded(url, mediaInfo.type);
        }
        setSuccess(true);
        setUrl('');
        return;
      }

      // For direct media files, fetch and upload to Firebase
      if (['image', 'video', 'audio', 'pdf'].includes(mediaInfo.type)) {
        setProgress('Downloading file...');
        const blob = await fetchFileFromUrl(url);
        
        if (!blob) {
          throw new Error('Failed to download file');
        }

        setProgress('Uploading to storage...');
        const mimeType = getMimeType(url, mediaInfo.fileExtension);
        const file = new File([blob], `media-${Date.now()}.${mediaInfo.fileExtension}`, { type: mimeType });
        
        const uploadPath = `media/${Date.now()}_${mediaInfo.fileExtension}`;
        const uploadedUrl = await uploadFile(file, uploadPath);

        setProgress('Upload complete!');
        if (onMediaAdded) {
          onMediaAdded(uploadedUrl, mediaInfo.type);
        }
        setSuccess(true);
        setUrl('');
        return;
      }

      // For regular links, just pass the URL
      setProgress('Link added');
      if (onMediaAdded) {
        onMediaAdded(url, 'link');
      }
      setSuccess(true);
      setUrl('');

    } catch (err: any) {
      console.error('Media upload error:', err);
      setError(err.message || 'Failed to fetch and upload media');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setProgress('');
        setSuccess(false);
      }, 2000);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="url"
            placeholder="Paste URL (YouTube, image, video, audio, PDF, etc.)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button
          onClick={handleFetchAndUpload}
          disabled={loading || !url.trim()}
          className="flex items-center gap-2"
        >
          <LinkIcon className="h-4 w-4" />
          {loading ? 'Fetching...' : 'Add Media'}
        </Button>
      </div>

      {/* Progress */}
      {progress && (
        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
          <span>{progress}</span>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
          <p className="text-sm text-green-600 dark:text-green-400">
            Media added successfully!
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Supported formats */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>Supported: YouTube, Vimeo, Spotify, SoundCloud, images, videos, audio, PDFs, and more</p>
      </div>
    </div>
  );
}
