# 🎬 Media Viewer & URL Fetching Features

**Added**: October 2025  
**Version**: v2.3.0

---

## 🎯 New Features

### 1. Universal Media Viewer
Automatically detect and display any type of media from URLs.

### 2. Direct URL Fetching
Paste any link and automatically fetch, process, and display the media.

### 3. Multi-Platform Embeds
Native support for YouTube, Vimeo, Spotify, SoundCloud, and more.

### 4. Media Playback
Built-in players for images, videos, audio, and PDFs.

---

## 🎬 Supported Media Types

### 🖼️ Images
- **Formats**: JPG, JPEG, PNG, GIF, WebP, SVG, BMP, ICO
- **Features**:
  - Fullscreen viewer
  - Download button
  - Responsive sizing
  - Loading states
  - Error handling

### 🎥 Videos
- **Formats**: MP4, WebM, OGG, MOV, AVI, MKV, M4V
- **Features**:
  - HTML5 video player
  - Play/pause controls
  - Volume control
  - Fullscreen support
  - Download option

### 🎵 Audio
- **Formats**: MP3, WAV, OGG, M4A, FLAC, AAC, WMA
- **Features**:
  - Custom audio player
  - Playback controls
  - Volume control
  - Download option
  - Track title display

### 📄 PDFs
- **Features**:
  - Embedded PDF viewer
  - Page navigation
  - Zoom controls
  - Download button
  - Open in new tab

### 🎞️ Embeddable Platforms

**YouTube**
- Auto-detect YouTube URLs
- Embed player with controls
- Thumbnail preview
- Direct playback

**Vimeo**
- Auto-detect Vimeo URLs
- Embedded player
- High-quality playback

**Spotify**
- Songs, albums, playlists
- Embedded player
- Full Spotify integration

**SoundCloud**
- Tracks and playlists
- Embedded player
- Waveform visualization

### 🔗 Documents & Links
- **Formats**: DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, MD
- **Features**:
  - Link preview with favicon
  - Click to open
  - Domain extraction
  - External link indicator

---

## 🚀 Usage

### Basic Media Viewer

```tsx
import MediaViewer from '@/components/media/MediaViewer';

<MediaViewer 
  url="https://example.com/video.mp4" 
  autoPlay={false}
  controls={true}
/>
```

The MediaViewer automatically:
1. Detects media type from URL
2. Chooses appropriate viewer/player
3. Loads and displays content
4. Handles errors gracefully

### Upload Media from URL

```tsx
import MediaUploadFromUrl from '@/components/media/MediaUploadFromUrl';

<MediaUploadFromUrl 
  onMediaAdded={(url, type) => {
    console.log('Added:', type, url);
    // Insert into editor
  }}
/>
```

**How it works:**
1. User pastes URL
2. System detects media type
3. Downloads file (if applicable)
4. Uploads to Firebase Storage
5. Returns hosted URL
6. Inserts into note

### Individual Players

**Image Viewer:**
```tsx
import ImageViewer from '@/components/media/ImageViewer';

<ImageViewer 
  url="https://example.com/image.jpg"
  alt="Description"
/>
```

**Video Player:**
```tsx
import VideoPlayer from '@/components/media/VideoPlayer';

<VideoPlayer 
  url="https://example.com/video.mp4"
  autoPlay={false}
  controls={true}
/>
```

**Audio Player:**
```tsx
import AudioPlayer from '@/components/media/AudioPlayer';

<AudioPlayer 
  url="https://example.com/song.mp3"
  title="Song Title"
  controls={true}
/>
```

**PDF Viewer:**
```tsx
import PDFViewer from '@/components/media/PDFViewer';

<PDFViewer 
  url="https://example.com/document.pdf"
  height={600}
/>
```

**Embed Player:**
```tsx
import EmbedPlayer from '@/components/media/EmbedPlayer';

<EmbedPlayer mediaInfo={{
  url: 'https://youtube.com/watch?v=xxx',
  type: 'youtube',
  embedUrl: 'https://youtube.com/embed/xxx',
  provider: 'YouTube'
}} />
```

**Link Preview:**
```tsx
import LinkPreview from '@/components/media/LinkPreview';

<LinkPreview url="https://example.com" />
```

---

## 🔧 API Reference

### URL Parser Functions

**Detect Media Type:**
```typescript
import { detectMediaType } from '@/lib/media/url-parser';

const type = detectMediaType('https://youtube.com/watch?v=xxx');
// Returns: 'youtube'
```

**Parse Media URL:**
```typescript
import { parseMediaUrl } from '@/lib/media/url-parser';

const info = await parseMediaUrl(url);
// Returns: MediaInfo object with type, embedUrl, thumbnail, etc.
```

**Fetch File from URL:**
```typescript
import { fetchFileFromUrl } from '@/lib/media/url-parser';

const blob = await fetchFileFromUrl(url);
// Returns: Blob or null
```

**Download File:**
```typescript
import { downloadFileFromUrl } from '@/lib/media/url-parser';

await downloadFileFromUrl(url, 'filename.ext');
// Triggers browser download
```

**Get MIME Type:**
```typescript
import { getMimeType } from '@/lib/media/url-parser';

const mimeType = getMimeType('https://example.com/file.mp4');
// Returns: 'video/mp4'
```

---

## 🎨 Features

### Image Viewer
- ✅ Responsive display
- ✅ Fullscreen mode
- ✅ Download button
- ✅ Loading spinner
- ✅ Error handling
- ✅ Alt text support
- ✅ Hover controls

### Video Player
- ✅ HTML5 video
- ✅ Play/pause
- ✅ Volume control
- ✅ Fullscreen
- ✅ Playback speed
- ✅ Picture-in-picture
- ✅ Download option

### Audio Player
- ✅ Custom controls
- ✅ Play/pause
- ✅ Volume
- ✅ Progress bar
- ✅ Time display
- ✅ Download
- ✅ Title display

### PDF Viewer
- ✅ Embedded viewer
- ✅ Page navigation
- ✅ Zoom controls
- ✅ Download button
- ✅ Open in new tab
- ✅ Fallback options

### Embed Players
- ✅ YouTube: Full player with controls
- ✅ Vimeo: HD playback
- ✅ Spotify: Songs/albums/playlists
- ✅ SoundCloud: Tracks with waveform
- ✅ Responsive embeds
- ✅ Aspect ratio maintained

### Link Preview
- ✅ Favicon display
- ✅ URL truncation
- ✅ External link indicator
- ✅ Clickable card
- ✅ Hover effects

---

## 💡 Use Cases

### In Notes

**Add YouTube Video:**
```
1. Click "Add Media from URL"
2. Paste: https://youtube.com/watch?v=dQw4w9WgXcQ
3. Click "Add Media"
4. YouTube player embedded in note!
```

**Add Image from URL:**
```
1. Paste: https://example.com/photo.jpg
2. Image downloaded and uploaded to Firebase
3. Hosted image URL inserted
4. Image displays in note
```

**Add PDF Document:**
```
1. Paste: https://example.com/report.pdf
2. PDF viewer embedded
3. Read/download in-app
```

**Add Spotify Track:**
```
1. Paste: https://open.spotify.com/track/xxx
2. Spotify player embedded
3. Listen directly in note
```

### Quick Media Import

1. Copy any media URL
2. Paste in editor
3. Click "Add Media from URL"
4. Media automatically:
   - Detected
   - Fetched (if needed)
   - Uploaded (if needed)
   - Embedded in note

### Supported URLs Examples

```
Images:
https://picsum.photos/800/600
https://unsplash.com/photos/xyz/download

Videos:
https://youtube.com/watch?v=xxx
https://vimeo.com/123456789
https://example.com/video.mp4

Audio:
https://soundcloud.com/artist/track
https://open.spotify.com/track/xxx
https://example.com/song.mp3

Documents:
https://example.com/document.pdf
https://arxiv.org/pdf/1234.56789.pdf

Links:
https://any-website.com
```

---

## 🔒 Security

### CORS Handling
- Fetches files with proper CORS headers
- Handles CORS errors gracefully
- Uploads to Firebase for reliable hosting

### Safe Embeds
- All embeds use HTTPS
- No script injection
- Sandboxed iframes
- Security headers applied

### Content Validation
- URL validation before fetch
- MIME type checking
- File size limits
- Error boundaries

---

## 📊 Technical Implementation

### Architecture

```
URL Input
  ↓
Parse & Detect Type
  ↓
├─ Embed (YouTube, etc.) → Direct embed
├─ Media File → Fetch → Upload → Display
└─ Link → Preview card
```

### Components Structure

```
components/media/
├── MediaViewer.tsx         # Main viewer (auto-detection)
├── ImageViewer.tsx         # Image display
├── VideoPlayer.tsx         # Video playback
├── AudioPlayer.tsx         # Audio playback
├── PDFViewer.tsx          # PDF display
├── EmbedPlayer.tsx        # Platform embeds
├── LinkPreview.tsx        # Link cards
└── MediaUploadFromUrl.tsx # URL import
```

### Utilities

```
lib/media/
└── url-parser.ts
    ├── detectMediaType()
    ├── parseMediaUrl()
    ├── fetchFileFromUrl()
    ├── downloadFileFromUrl()
    ├── getMimeType()
    └── checkUrlAccessibility()
```

---

## 🎯 Integration with Editor

### Add to Slash Commands

In `SlashCommands.tsx`, add:
```typescript
{
  title: 'Media from URL',
  description: 'Embed media from any URL',
  command: ({ editor, range }) => {
    // Show media URL input modal
  },
},
```

### Add to Toolbar

In `EditorToolbar.tsx`, add:
```typescript
<MediaUploadFromUrl 
  onMediaAdded={(url, type) => {
    editor.commands.insertContent({
      type: 'paragraph',
      content: [{ type: 'text', text: url }]
    });
  }}
/>
```

### Usage in Notes

```tsx
// In note editor
import MediaViewer from '@/components/media/MediaViewer';

{note.mediaUrls?.map(url => (
  <MediaViewer key={url} url={url} />
))}
```

---

## 📱 Responsive Design

All media viewers are fully responsive:

**Mobile (< 640px)**:
- Full-width display
- Touch-friendly controls
- Optimized loading
- Swipe gestures (images)

**Tablet (640px - 1024px)**:
- Optimized sizing
- Touch controls
- Landscape/portrait support

**Desktop (> 1024px)**:
- Max-width constraints
- Hover controls
- Keyboard shortcuts
- High-quality playback

---

## 🎨 Customization

### Styling

All components accept `className` prop:
```tsx
<MediaViewer 
  url={url}
  className="my-custom-classes"
/>
```

### Auto-play

Control auto-play for video/audio:
```tsx
<VideoPlayer 
  url={url}
  autoPlay={true}  // Auto-play
  controls={true}   // Show controls
/>
```

### Custom Heights

For PDFs and embeds:
```tsx
<PDFViewer url={url} height={800} />
```

---

## ⚡ Performance

### Optimizations

- ✅ Lazy loading for embeds
- ✅ Progressive image loading
- ✅ Video buffering
- ✅ Audio preloading
- ✅ PDF pagination
- ✅ Thumbnail generation

### Bandwidth

- Images: Responsive sizing
- Videos: Adaptive quality
- Audio: Compressed formats
- PDFs: Page-by-page loading

---

## 🔄 Workflow Examples

### Example 1: Add YouTube Video

```
1. User pastes: https://youtube.com/watch?v=dQw4w9WgXcQ
2. System detects: YouTube video
3. Extracts video ID: dQw4w9WgXcQ
4. Creates embed URL: https://youtube.com/embed/dQw4w9WgXcQ
5. Renders: YouTube embed player
6. User can play inline!
```

### Example 2: Add External Image

```
1. User pastes: https://unsplash.com/photos/abc/download
2. System detects: Image (JPG)
3. Downloads image from URL
4. Uploads to Firebase Storage
5. Gets hosted URL: https://firebase.com/...
6. Renders: ImageViewer component
7. User sees image with fullscreen/download options
```

### Example 3: Add PDF Document

```
1. User pastes: https://arxiv.org/pdf/1234.pdf
2. System detects: PDF
3. Renders: Embedded PDF viewer
4. User can read/download in-app
```

---

## 🛠️ Advanced Features

### Custom Media Handler

Create custom viewers:
```tsx
import { detectMediaType } from '@/lib/media/url-parser';

function CustomMediaHandler({ url }: { url: string }) {
  const type = detectMediaType(url);
  
  switch (type) {
    case 'custom':
      return <CustomViewer url={url} />;
    default:
      return <MediaViewer url={url} />;
  }
}
```

### Batch Media Import

```tsx
const urls = [
  'https://youtube.com/...',
  'https://example.com/image.jpg',
  'https://spotify.com/...',
];

urls.forEach(async (url) => {
  const mediaInfo = await parseMediaUrl(url);
  // Process each media
});
```

### Media Library

Store all media URLs in note:
```typescript
interface Note {
  // ...existing fields
  media: {
    url: string;
    type: string;
    addedAt: Date;
  }[];
}
```

---

## 📋 Supported URLs

### Images
```
https://example.com/photo.jpg
https://picsum.photos/800/600
https://unsplash.com/photos/xxx
https://imgur.com/xxx.png
```

### Videos
```
https://youtube.com/watch?v=xxx
https://youtu.be/xxx
https://vimeo.com/123456789
https://example.com/video.mp4
```

### Audio
```
https://soundcloud.com/artist/track
https://open.spotify.com/track/xxx
https://open.spotify.com/album/xxx
https://open.spotify.com/playlist/xxx
https://example.com/song.mp3
```

### Documents
```
https://example.com/document.pdf
https://arxiv.org/pdf/1234.5678.pdf
https://drive.google.com/file/d/xxx/view (direct link)
```

### Social Media
```
YouTube: youtube.com/watch?v=xxx
Vimeo: vimeo.com/123456789
Spotify: open.spotify.com/track/xxx
SoundCloud: soundcloud.com/artist/track
```

---

## 🎯 Integration Examples

### In Tiptap Editor

Add media node to Tiptap:
```typescript
import { Node } from '@tiptap/core';

export const MediaNode = Node.create({
  name: 'media',
  group: 'block',
  atom: true,
  
  addAttributes() {
    return {
      url: { default: null },
      type: { default: 'link' },
    };
  },
  
  parseHTML() {
    return [{ tag: 'div[data-media]' }];
  },
  
  renderHTML({ node }) {
    return ['div', { 'data-media': true }, node.attrs.url];
  },
  
  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      // Render MediaViewer component
      return { dom };
    };
  },
});
```

### In Dashboard

Show recent media:
```tsx
{notes.flatMap(note => note.media || [])
  .slice(0, 10)
  .map(media => (
    <MediaViewer key={media.url} url={media.url} />
  ))}
```

---

## 🔄 Workflow

### URL to Media Flow

```
1. User Input
   ↓
2. Paste URL
   ↓
3. Click "Add Media"
   ↓
4. Detect Type (image, video, youtube, etc.)
   ↓
5. Process:
   ├─ Embed: Use embed URL
   ├─ File: Download → Upload → Get URL
   └─ Link: Create preview
   ↓
6. Display
   ↓
7. User interacts (play, download, fullscreen)
```

---

## ⚠️ Limitations

### CORS Issues
- Some sites block external fetching
- Solution: Upload file manually or use embed

### File Size
- Large videos may take time to download
- Firebase Storage limits apply
- Recommend: < 100 MB per file

### Platform Support
- Not all sites allow embedding
- Some may require API keys
- Check platform's embed policies

---

## 🎁 Benefits

✅ **User-Friendly**: Paste URL and go  
✅ **Universal**: Works with any media type  
✅ **Fast**: Automatic detection  
✅ **Reliable**: Uploads to Firebase  
✅ **Secure**: Validates and sanitizes  
✅ **Responsive**: Works on all devices  
✅ **Accessible**: Keyboard navigation  
✅ **Offline**: Downloaded media cached  

---

## 🚀 Future Enhancements

### Planned Features
- [ ] Instagram embed support
- [ ] Twitter/X embed
- [ ] TikTok embed
- [ ] GitHub Gist embed
- [ ] CodePen embed
- [ ] Google Drive viewer
- [ ] Dropbox viewer
- [ ] Media gallery view
- [ ] Bulk URL import
- [ ] Media search in notes

---

## 📞 Examples in Action

### Rich Media Note

```markdown
# Project Presentation

## Overview Video
[YouTube: https://youtube.com/watch?v=xxx]

## Design Mockups
[Image: https://example.com/mockup1.png]
[Image: https://example.com/mockup2.png]

## Background Music
[Spotify: https://open.spotify.com/track/xxx]

## Documentation
[PDF: https://example.com/specs.pdf]

## References
[Link: https://example.com]
```

All media automatically embedded and playable!

---

## ✅ Quick Start

1. **In your note editor**, add media URL input
2. **Paste any URL** (image, video, YouTube, etc.)
3. **Click "Add Media"**
4. **Media appears** in your note
5. **Play, view, or download!**

---

## 🎉 Summary

Your CogniNote can now:
- ✅ Fetch media from any URL
- ✅ Auto-detect media types
- ✅ Embed YouTube, Vimeo, Spotify, SoundCloud
- ✅ Play videos and audio inline
- ✅ View PDFs in-app
- ✅ Display images with fullscreen
- ✅ Preview links with favicons
- ✅ Download any media
- ✅ Fully responsive on all devices

**Total**: 9 new components, 1 utility library, full media support!

---

**Repository**: https://github.com/Theguardians58/Notre-  
**Version**: v2.3.0  
**Status**: Production Ready ✅
