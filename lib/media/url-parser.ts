/**
 * URL Parser and Media Fetcher
 * Detect and fetch media from URLs
 */

export interface MediaInfo {
  url: string;
  type: 'image' | 'video' | 'audio' | 'pdf' | 'document' | 'link' | 'youtube' | 'vimeo' | 'spotify' | 'soundcloud';
  title?: string;
  description?: string;
  thumbnail?: string;
  provider?: string;
  embedUrl?: string;
  fileExtension?: string;
  mimeType?: string;
}

/**
 * Detect media type from URL
 */
export function detectMediaType(url: string): MediaInfo['type'] {
  const urlLower = url.toLowerCase();
  
  // YouTube
  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return 'youtube';
  }
  
  // Vimeo
  if (urlLower.includes('vimeo.com')) {
    return 'vimeo';
  }
  
  // Spotify
  if (urlLower.includes('spotify.com')) {
    return 'spotify';
  }
  
  // SoundCloud
  if (urlLower.includes('soundcloud.com')) {
    return 'soundcloud';
  }
  
  // Image extensions
  if (/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?|$)/i.test(url)) {
    return 'image';
  }
  
  // Video extensions
  if (/\.(mp4|webm|ogg|mov|avi|mkv|m4v)(\?|$)/i.test(url)) {
    return 'video';
  }
  
  // Audio extensions
  if (/\.(mp3|wav|ogg|m4a|flac|aac|wma)(\?|$)/i.test(url)) {
    return 'audio';
  }
  
  // PDF
  if (/\.pdf(\?|$)/i.test(url)) {
    return 'pdf';
  }
  
  // Documents
  if (/\.(doc|docx|xls|xlsx|ppt|pptx|txt|md)(\?|$)/i.test(url)) {
    return 'document';
  }
  
  return 'link';
}

/**
 * Parse media from URL
 */
export async function parseMediaUrl(url: string): Promise<MediaInfo> {
  const type = detectMediaType(url);
  const info: MediaInfo = { url, type };
  
  // Extract file extension
  const match = url.match(/\.([a-z0-9]+)(\?|$)/i);
  if (match) {
    info.fileExtension = match[1];
  }
  
  // Platform-specific parsing
  switch (type) {
    case 'youtube':
      return parseYouTubeUrl(url);
    case 'vimeo':
      return parseVimeoUrl(url);
    case 'spotify':
      return parseSpotifyUrl(url);
    case 'soundcloud':
      return parseSoundCloudUrl(url);
    default:
      return info;
  }
}

/**
 * Parse YouTube URL
 */
function parseYouTubeUrl(url: string): MediaInfo {
  let videoId = '';
  
  // Extract video ID
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
  } else if (url.includes('youtube.com/watch')) {
    const urlParams = new URL(url).searchParams;
    videoId = urlParams.get('v') || '';
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || '';
  }
  
  return {
    url,
    type: 'youtube',
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    provider: 'YouTube',
  };
}

/**
 * Parse Vimeo URL
 */
function parseVimeoUrl(url: string): MediaInfo {
  const match = url.match(/vimeo\.com\/(\d+)/);
  const videoId = match ? match[1] : '';
  
  return {
    url,
    type: 'vimeo',
    embedUrl: `https://player.vimeo.com/video/${videoId}`,
    provider: 'Vimeo',
  };
}

/**
 * Parse Spotify URL
 */
function parseSpotifyUrl(url: string): MediaInfo {
  // Extract track/album/playlist ID
  const match = url.match(/spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
  const itemType = match ? match[1] : 'track';
  const itemId = match ? match[2] : '';
  
  return {
    url,
    type: 'spotify',
    embedUrl: `https://open.spotify.com/embed/${itemType}/${itemId}`,
    provider: 'Spotify',
  };
}

/**
 * Parse SoundCloud URL
 */
function parseSoundCloudUrl(url: string): MediaInfo {
  return {
    url,
    type: 'soundcloud',
    embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`,
    provider: 'SoundCloud',
  };
}

/**
 * Fetch file from URL
 */
export async function fetchFileFromUrl(url: string): Promise<Blob | null> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error fetching file from URL:', error);
    return null;
  }
}

/**
 * Get MIME type from URL or extension
 */
export function getMimeType(url: string, extension?: string): string {
  const ext = extension || url.split('.').pop()?.toLowerCase();
  
  const mimeTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    
    // Videos
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogg: 'video/ogg',
    mov: 'video/quicktime',
    
    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    m4a: 'audio/mp4',
    flac: 'audio/flac',
    
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain',
    md: 'text/markdown',
  };
  
  return mimeTypes[ext || ''] || 'application/octet-stream';
}

/**
 * Download file from URL
 */
export async function downloadFileFromUrl(url: string, filename?: string): Promise<void> {
  try {
    const blob = await fetchFileFromUrl(url);
    if (!blob) return;
    
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename || url.split('/').pop() || 'download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Download failed:', error);
  }
}

/**
 * Check if URL is accessible (CORS-safe)
 */
export async function checkUrlAccessibility(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    return true;
  } catch (error) {
    return false;
  }
}
