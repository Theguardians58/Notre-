# 🚗 Google Drive Integration Guide

**Upload, fetch, and play media files directly from Google Drive in CogniNote**

---

## 🎯 Overview

CogniNote now supports **Google Drive** as a storage option, allowing you to:

✅ **Upload** media files directly to your Google Drive  
✅ **Fetch** files from Google Drive instantly  
✅ **Play** videos, audio, and view images directly  
✅ **Embed** Drive files in your notes  
✅ **Organize** files in a dedicated CogniNote folder  
✅ **Access** 15 GB free storage (or more with Google One)  

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Click **"New Project"**
3. Name it: `CogniNote`
4. Click **"Create"**

### Step 2: Enable Google Drive API

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Drive API"**
3. Click **"Enable"**

### Step 3: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ Create Credentials"** → **"OAuth client ID"**
3. Choose **"Web application"**
4. Add **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   https://your-domain.com
   https://your-netlify-app.netlify.app
   ```
5. Click **"Create"**
6. **Copy the Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)

### Step 4: Create API Key

1. Click **"+ Create Credentials"** → **"API key"**
2. **Copy the API Key** (looks like: `AIza...`)
3. (Optional) Restrict the key to Google Drive API only

### Step 5: Configure CogniNote

1. In CogniNote, go to **Settings** → **Storage**
2. Find the **"Google Drive Storage"** section
3. Paste your **Client ID**
4. Paste your **API Key**
5. Click **"Save Configuration"**
6. Click **"Connect to Google Drive"**
7. Sign in with your Google account
8. Grant permissions

**Done!** You're now connected! 🎉

---

## 📤 Uploading Files

### Method 1: Upload Component (In Settings)

1. Go to **Settings** → **Storage**
2. Scroll to **"Upload to Google Drive"**
3. Drag & drop or click to browse
4. Select your file
5. File uploads to `CogniNote` folder in your Drive
6. Get file ID to embed in notes

### Method 2: In Editor (Coming Soon)

```typescript
// Upload while editing a note
<GoogleDriveUpload
  onUploadComplete={(fileId, fileName, mimeType) => {
    // Insert into note
    editor.commands.insertContent({
      type: 'googleDriveEmbed',
      attrs: { fileId, fileName, mimeType }
    });
  }}
/>
```

### Method 3: URL from Existing Drive File

1. Right-click file in Google Drive
2. Click **"Get link"** → **"Anyone with the link"**
3. Copy the file ID from URL:
   ```
   https://drive.google.com/file/d/FILE_ID_HERE/view
   ```
4. Paste in CogniNote media viewer

---

## 🎬 Playing Media from Google Drive

### Supported File Types

**Images:**
- ✅ JPG, JPEG, PNG, GIF, WebP, SVG, BMP
- Direct preview with full resolution
- Fullscreen viewer

**Videos:**
- ✅ MP4, WebM, OGG, MOV, AVI
- Embedded Google Drive player
- Playback controls
- HD quality

**Audio:**
- ✅ MP3, WAV, M4A, OGG, FLAC
- Custom audio player
- Waveform (if available)
- Download option

**Documents:**
- ✅ PDF files
- Embedded viewer
- Page navigation
- Download and print

### How to Play

**Option 1: Use File ID**
```typescript
<GoogleDrivePlayer 
  fileId="1abc...xyz" 
  fileName="video.mp4"
  mimeType="video/mp4"
/>
```

**Option 2: Paste Drive Link**
```
https://drive.google.com/file/d/1abc...xyz/view
```
CogniNote automatically detects and plays!

**Option 3: File Picker**
```typescript
<GoogleDrivePicker
  onFileSelect={(fileId, fileName, mimeType) => {
    // Auto-play selected file
  }}
  filterTypes={['video/', 'audio/']}
/>
```

---

## 🔗 URL Formats

Google Drive supports multiple URL formats:

### View Link
```
https://drive.google.com/file/d/FILE_ID/view
```
Opens in Google Drive viewer

### Preview Link
```
https://drive.google.com/file/d/FILE_ID/preview
```
Embeddable iframe

### Direct Download
```
https://drive.google.com/uc?export=download&id=FILE_ID
```
Forces download

### Direct View (For embedding)
```
https://drive.google.com/uc?export=view&id=FILE_ID
```
Direct image/video URL

---

## 🎨 Components

### GoogleDriveSetup

Configuration component for settings page:

```tsx
import GoogleDriveSetup from '@/components/storage/GoogleDriveSetup';

<GoogleDriveSetup />
```

**Features:**
- Save Client ID and API Key
- Connect/disconnect
- Connection status indicator
- Setup instructions

### GoogleDriveUpload

Upload files to Google Drive:

```tsx
import GoogleDriveUpload from '@/components/storage/GoogleDriveUpload';

<GoogleDriveUpload
  onUploadComplete={(fileId, fileName, mimeType) => {
    console.log('Uploaded:', fileId);
  }}
  acceptedTypes="image/*,video/*"
  maxSizeMB={100}
/>
```

**Features:**
- Drag & drop
- File type filtering
- Size validation
- Progress indicator
- Upload to CogniNote folder

### GoogleDrivePlayer

Play media from Google Drive:

```tsx
import GoogleDrivePlayer from '@/components/storage/GoogleDrivePlayer';

<GoogleDrivePlayer
  fileId="1abc...xyz"
  fileName="video.mp4"
  mimeType="video/mp4"
  showControls={true}
/>
```

**Features:**
- Auto-detect file type
- Appropriate player for each type
- Download button
- Open in Drive button
- Fullscreen support

### GoogleDrivePicker

Browse and select Drive files:

```tsx
import GoogleDrivePicker from '@/components/storage/GoogleDrivePicker';

<GoogleDrivePicker
  onFileSelect={(fileId, fileName, mimeType) => {
    // Embed in note
  }}
  filterTypes={['video/', 'image/']}
/>
```

**Features:**
- Browse your Drive files
- Search by name
- Filter by type
- File metadata display
- One-click selection

---

## 💾 Storage Details

### Folder Structure

```
Google Drive
└── CogniNote/
    ├── images/
    ├── videos/
    ├── audio/
    └── documents/
```

CogniNote automatically creates and organizes files in your Drive.

### File Permissions

**By Default:**
- Files are made **publicly accessible** (anyone with link)
- This allows embedding in notes
- You can change permissions in Google Drive

**To Keep Private:**
- Modify permissions after upload
- Use signed URLs (coming soon)
- Share only with specific users

---

## 🔐 Security & Privacy

### Authentication

- **OAuth 2.0** - Secure authorization
- **Scoped Access** - Only Drive files, not full account
- **Revocable** - Disconnect anytime
- **Client-Side** - No server stores your tokens

### Permissions Required

```
https://www.googleapis.com/auth/drive.file
```

**This allows:**
- ✅ Create and upload files
- ✅ Read files created by the app
- ✅ Update files created by the app
- ✅ Delete files created by the app

**This does NOT allow:**
- ❌ Access to ALL your Drive files
- ❌ Reading other apps' files
- ❌ Modifying existing files

**Very Safe!** Only files uploaded via CogniNote are accessible.

---

## 💰 Pricing & Limits

### Free Tier (Every Google Account)
- **15 GB** storage (shared with Gmail and Photos)
- **Unlimited** API requests
- **No bandwidth** charges
- **Free forever**

### Google One (Optional)
- **100 GB** - $1.99/month
- **200 GB** - $2.99/month
- **2 TB** - $9.99/month
- **More options** available

### Comparison

| Storage | Free Tier | Cost at 100GB |
|---------|-----------|---------------|
| **Google Drive** | 15 GB | $1.99/month |
| **Google Cloud Storage** | 0 GB (pay as you go) | $2.60/month |
| **Firebase Storage** | 5 GB | ~$2.60/month |
| **Supabase Storage** | 1 GB | Included in Pro ($25) |

**Winner:** Google Drive for casual users! 🏆

---

## 🎯 Use Cases

### Best For:

✅ **Personal Use**
- Already have Google account
- Don't want to pay for extra storage
- 15 GB is enough
- Want easy file access

✅ **Small Teams**
- Share files via Drive
- Collaborate on documents
- Sync across devices

✅ **Students**
- Free storage
- Easy to use
- Access from school/home

### Not Ideal For:

⚠️ **Large Files**
- Video projects > 100 GB
- High-res photo collections
- Use GCS instead

⚠️ **High Traffic**
- Public websites with many views
- Use CDN instead
- Consider GCS

---

## 🔧 Advanced Features

### Custom Folders

```typescript
// Upload to specific folder
const folderId = 'your-folder-id';
await uploadToGoogleDrive(file, config, folderId);
```

### Batch Upload

```typescript
// Upload multiple files
const files = [file1, file2, file3];
for (const file of files) {
  await uploadToGoogleDrive(file, config);
}
```

### File Metadata

```typescript
// Get file details
const file = await getFileFromDrive(fileId, config);
console.log(file.name, file.size, file.mimeType);
```

### Direct Embedding

```html
<!-- Embed image -->
<img src="https://drive.google.com/uc?export=view&id=FILE_ID" />

<!-- Embed video -->
<iframe src="https://drive.google.com/file/d/FILE_ID/preview" />

<!-- Embed audio -->
<audio src="https://drive.google.com/uc?export=view&id=FILE_ID" controls />
```

---

## 🐛 Troubleshooting

### Issue 1: "Failed to authenticate"

**Solution:**
- Check Client ID is correct
- Check API Key is correct
- Enable Google Drive API in console
- Add your domain to authorized origins

### Issue 2: "Failed to upload"

**Solution:**
- Check file size (< 100 MB for free accounts)
- Ensure you're signed in to Google
- Check Drive storage quota
- Try refreshing the connection

### Issue 3: "File not found"

**Solution:**
- File might be deleted
- Check permissions (file must be accessible)
- Verify file ID is correct
- Re-authenticate

### Issue 4: "Quota exceeded"

**Solution:**
- You've used all 15 GB free storage
- Upgrade to Google One
- Delete unused files
- Use Google Cloud Storage instead

---

## 🆚 Google Drive vs Google Cloud Storage

| Feature | Google Drive | Google Cloud Storage |
|---------|--------------|----------------------|
| **Free Storage** | 15 GB | 0 GB (pay-as-you-go) |
| **Ease of Use** | ✅ Very Easy | ⚠️ Technical |
| **Cost (100GB)** | $1.99/month | $2.60/month |
| **File Sharing** | ✅ Built-in | ⚠️ Manual |
| **Versioning** | ✅ Automatic | ⚠️ Optional |
| **Access Control** | ✅ Easy | ⚠️ IAM policies |
| **CDN** | ❌ No | ✅ Yes |
| **Best For** | Personal use | Production apps |

---

## ✅ Configuration Checklist

- [ ] Google Cloud project created
- [ ] Google Drive API enabled
- [ ] OAuth 2.0 credentials created
- [ ] API key created
- [ ] Authorized origins added
- [ ] Client ID copied
- [ ] API Key copied
- [ ] Configuration saved in CogniNote
- [ ] Connected to Google Drive
- [ ] Test upload successful

---

## 📚 API Reference

### Upload Functions

```typescript
// Upload file
uploadToGoogleDrive(file: File, config: GoogleDriveConfig, folderId?: string): Promise<DriveFile>

// Get/create CogniNote folder
getOrCreateCogniNoteFolder(config: GoogleDriveConfig): Promise<string>
```

### Fetch Functions

```typescript
// Get file metadata
getFileFromDrive(fileId: string, config: GoogleDriveConfig): Promise<DriveFile>

// List files
listGoogleDriveFiles(config: GoogleDriveConfig, folderId?: string): Promise<DriveFile[]>
```

### URL Functions

```typescript
// Direct download URL
getGoogleDriveDownloadUrl(fileId: string): string

// Preview/embed URL
getGoogleDrivePreviewUrl(fileId: string): string

// Direct view URL (images/videos)
getGoogleDriveDirectUrl(fileId: string): string
```

### Delete Functions

```typescript
// Delete file
deleteGoogleDriveFile(fileId: string, config: GoogleDriveConfig): Promise<void>
```

---

## 🎨 Example Usage

### Complete Upload Flow

```typescript
import { uploadToGoogleDrive, getOrCreateCogniNoteFolder } from '@/lib/storage/google-drive';

// 1. Get configuration
const config = JSON.parse(localStorage.getItem('googleDriveConfig'));

// 2. Get CogniNote folder
const folderId = await getOrCreateCogniNoteFolder(config);

// 3. Upload file
const file = document.querySelector('input[type=file]').files[0];
const result = await uploadToGoogleDrive(file, config, folderId);

// 4. Use in note
console.log('File ID:', result.id);
console.log('File URL:', result.webViewLink);
```

### Fetch and Display

```typescript
import GoogleDrivePlayer from '@/components/storage/GoogleDrivePlayer';

// In your component
<GoogleDrivePlayer
  fileId="1abc...xyz"
  fileName="vacation-video.mp4"
  mimeType="video/mp4"
  showControls={true}
/>
```

### Browse and Select

```typescript
import GoogleDrivePicker from '@/components/storage/GoogleDrivePicker';

<GoogleDrivePicker
  onFileSelect={(fileId, fileName, mimeType) => {
    // Insert into note
    insertDriveFile(fileId, fileName, mimeType);
  }}
  filterTypes={['image/', 'video/']}
/>
```

---

## 🔄 Integration with CogniNote Features

### With End-to-End Encryption

**Files stored in Google Drive are NOT encrypted by CogniNote.**

If you need encryption:
- Use Firebase/Appwrite/Supabase storage instead
- Or use Google Drive + manual encryption
- Or use encrypted file attachments feature

### With Media Viewer

Google Drive files work seamlessly with the media viewer:

```typescript
// Paste Google Drive URL
https://drive.google.com/file/d/FILE_ID/view

// CogniNote automatically:
// 1. Detects it's a Drive file
// 2. Extracts the file ID
// 3. Loads the file
// 4. Plays it in the appropriate player
```

### With Real-Time Collaboration

- Multiple users can upload to Drive
- Files sync via Drive's infrastructure
- Real-time updates when files are added
- Shared access if Drive permissions allow

---

## 🌟 Best Practices

### 1. Organize Files

Create folder structure:
```
CogniNote/
├── Projects/
│   ├── Project A/
│   └── Project B/
├── Personal/
└── Shared/
```

### 2. Use Descriptive Names

```typescript
// Good
"2024-10-06-meeting-recording.mp4"
"project-mockup-v2.png"

// Bad
"video1.mp4"
"image.png"
```

### 3. Manage Storage

- Regularly delete unused files
- Compress videos before upload
- Use lower quality for drafts
- Empty trash to free space

### 4. Backup Important Files

- Download local copies
- Use Google Takeout for backups
- Enable version history
- Keep originals

---

## 📊 File Size Limits

| File Type | Max Size (Free) | Max Size (Paid) |
|-----------|-----------------|-----------------|
| **Images** | 15 GB total | Unlimited (with storage) |
| **Videos** | 15 GB total | Unlimited |
| **Audio** | 15 GB total | Unlimited |
| **Documents** | 15 GB total | Unlimited |
| **Single File** | No limit | No limit |

**Note:** Individual file limits depend on your Drive storage quota.

---

## 🚀 Performance

### Upload Speed
- **Good:** Up to 10 MB/s
- Depends on your internet connection
- Automatic resume if interrupted

### Playback Speed
- **Excellent** for small files (< 100 MB)
- **Good** for videos (Google's CDN)
- **May buffer** for very large files

### Recommendations
- Compress videos to < 500 MB
- Use 1080p instead of 4K for web
- Optimize images before upload

---

## 🎯 Comparison: All Storage Options

| Feature | Firebase | Appwrite | Supabase | GCS | **Google Drive** ⭐ |
|---------|----------|----------|----------|-----|-------------------|
| **Free Storage** | 5 GB | Self-host | 1 GB | 0 GB | **15 GB** |
| **Ease of Setup** | Easy | Medium | Easy | Hard | **Easiest** |
| **File Sharing** | Manual | Manual | Manual | Manual | **Built-in** |
| **Versioning** | ❌ | ❌ | ❌ | ✅ | **✅ Auto** |
| **Mobile Access** | App | App | App | N/A | **✅ Native** |
| **Desktop Sync** | ❌ | ❌ | ❌ | ❌ | **✅ Yes** |
| **Best For** | Apps | Self-host | Apps | Enterprise | **Personal** |

---

## 📖 Resources

### Official Documentation
- **Google Drive API:** https://developers.google.com/drive/api/guides/about-sdk
- **OAuth 2.0:** https://developers.google.com/identity/protocols/oauth2
- **File Formats:** https://developers.google.com/drive/api/guides/mime-types

### Helpful Links
- **Google Cloud Console:** https://console.cloud.google.com/
- **Drive API Playground:** https://developers.google.com/oauthplayground/
- **Quota Limits:** https://developers.google.com/drive/api/guides/limits

---

## ✨ Summary

Google Drive integration gives you:

✅ **15 GB free storage** - More than most backends  
✅ **Easy to use** - Familiar Google interface  
✅ **Automatic sync** - Access from any device  
✅ **File versioning** - Never lose a version  
✅ **Built-in sharing** - Collaborate easily  
✅ **No vendor lock-in** - Your files, your control  

**Perfect for personal use and small teams!** 🚀

---

## 🎊 Quick Start Reminder

1. **Setup** (5 min) - Get Client ID and API Key
2. **Connect** - Sign in to Google Drive
3. **Upload** - Drag & drop your files
4. **Play** - Files work instantly in notes
5. **Enjoy** - 15 GB free storage! 🎉

---

**Ready to use Google Drive with CogniNote!** 🚗

**Next Steps:**
1. Follow setup guide above
2. Configure in Settings → Storage
3. Start uploading and embedding!

**Last Updated:** October 2025  
**CogniNote Version:** 1.0.0
