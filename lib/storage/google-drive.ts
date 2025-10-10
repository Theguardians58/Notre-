/**
 * Google Drive Integration
 * Upload and fetch media files directly from user's Google Drive
 */

export interface GoogleDriveConfig {
  clientId: string;
  apiKey: string;
  scopes: string[];
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  webViewLink: string;
  webContentLink: string;
  thumbnailLink?: string;
  createdTime: string;
}

// Default scopes for Google Drive access
const SCOPES = [
  'https://www.googleapis.com/auth/drive.file', // Access to files created by the app
  'https://www.googleapis.com/auth/drive.readonly', // Read-only access
];

/**
 * Initialize Google Drive API
 */
export async function initializeGoogleDrive(
  clientId: string,
  apiKey: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Load the Google API client
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      (window as any).gapi.load('client:auth2', async () => {
        try {
          await (window as any).gapi.client.init({
            apiKey,
            clientId,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            scope: SCOPES.join(' '),
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

/**
 * Sign in to Google Drive
 */
export async function signInToGoogleDrive(): Promise<any> {
  try {
    const auth = (window as any).gapi.auth2.getAuthInstance();
    const user = await auth.signIn();
    return user;
  } catch (error: any) {
    console.error('Google Drive signin error:', error);
    throw new Error('Failed to sign in to Google Drive');
  }
}

/**
 * Sign out from Google Drive
 */
export async function signOutFromGoogleDrive(): Promise<void> {
  try {
    const auth = (window as any).gapi.auth2.getAuthInstance();
    await auth.signOut();
  } catch (error: any) {
    console.error('Google Drive signout error:', error);
    throw new Error('Failed to sign out from Google Drive');
  }
}

/**
 * Check if user is signed in to Google Drive
 */
export function isSignedInToGoogleDrive(): boolean {
  try {
    const auth = (window as any).gapi?.auth2?.getAuthInstance();
    return auth?.isSignedIn?.get() || false;
  } catch (error) {
    return false;
  }
}

/**
 * Upload file to Google Drive
 */
export async function uploadToGoogleDrive(
  file: File,
  folderName: string = 'CogniNote'
): Promise<DriveFile> {
  try {
    // First, get or create the CogniNote folder
    const folderId = await getOrCreateFolder(folderName);

    // Create file metadata
    const metadata = {
      name: file.name,
      mimeType: file.type,
      parents: [folderId],
    };

    // Convert file to base64
    const base64Data = await fileToBase64(file);

    // Upload to Google Drive
    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          'Content-Type': 'multipart/related; boundary=foo_bar_baz',
        },
        body: createMultipartBody(metadata, base64Data, 'foo_bar_baz'),
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const fileData = await response.json();

    // Get file details
    return await getFileDetails(fileData.id);
  } catch (error: any) {
    console.error('Google Drive upload error:', error);
    throw new Error(error.message || 'Failed to upload to Google Drive');
  }
}

/**
 * Get or create folder in Google Drive
 */
async function getOrCreateFolder(folderName: string): Promise<string> {
  try {
    const gapi = (window as any).gapi;

    // Search for existing folder
    const response = await gapi.client.drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    if (response.result.files && response.result.files.length > 0) {
      return response.result.files[0].id;
    }

    // Create new folder
    const createResponse = await gapi.client.drive.files.create({
      resource: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id',
    });

    return createResponse.result.id;
  } catch (error: any) {
    console.error('Folder creation error:', error);
    throw new Error('Failed to create folder in Google Drive');
  }
}

/**
 * Get file details from Google Drive
 */
export async function getFileDetails(fileId: string): Promise<DriveFile> {
  try {
    const gapi = (window as any).gapi;
    const response = await gapi.client.drive.files.get({
      fileId,
      fields: 'id, name, mimeType, size, webViewLink, webContentLink, thumbnailLink, createdTime',
    });

    return response.result;
  } catch (error: any) {
    console.error('Get file details error:', error);
    throw new Error('Failed to get file details');
  }
}

/**
 * List files in CogniNote folder
 */
export async function listGoogleDriveFiles(
  folderName: string = 'CogniNote'
): Promise<DriveFile[]> {
  try {
    const gapi = (window as any).gapi;

    // Get folder ID
    const folderId = await getOrCreateFolder(folderName);

    // List files in folder
    const response = await gapi.client.drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, mimeType, size, webViewLink, webContentLink, thumbnailLink, createdTime)',
      orderBy: 'createdTime desc',
      pageSize: 100,
    });

    return response.result.files || [];
  } catch (error: any) {
    console.error('List files error:', error);
    throw new Error('Failed to list Google Drive files');
  }
}

/**
 * Delete file from Google Drive
 */
export async function deleteFromGoogleDrive(fileId: string): Promise<void> {
  try {
    const gapi = (window as any).gapi;
    await gapi.client.drive.files.delete({
      fileId,
    });
  } catch (error: any) {
    console.error('Delete file error:', error);
    throw new Error('Failed to delete file from Google Drive');
  }
}

/**
 * Get file download URL (for direct playback)
 */
export async function getGoogleDriveFileUrl(fileId: string): Promise<string> {
  try {
    // Make file publicly accessible (optional)
    const gapi = (window as any).gapi;
    
    // Create permission for anyone with the link
    await gapi.client.drive.permissions.create({
      fileId,
      resource: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Return direct download link with access token
    const accessToken = getAccessToken();
    return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&access_token=${accessToken}`;
  } catch (error: any) {
    console.error('Get file URL error:', error);
    // Fallback to webContentLink
    const file = await getFileDetails(fileId);
    return file.webContentLink || file.webViewLink;
  }
}

/**
 * Get access token
 */
function getAccessToken(): string {
  const auth = (window as any).gapi?.auth2?.getAuthInstance();
  return auth?.currentUser?.get()?.getAuthResponse()?.access_token || '';
}

/**
 * Convert file to base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Create multipart body for file upload
 */
function createMultipartBody(
  metadata: any,
  base64Data: string,
  boundary: string
): string {
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${metadata.mimeType}\r\n` +
    'Content-Transfer-Encoding: base64\r\n\r\n' +
    base64Data +
    closeDelimiter;

  return multipartRequestBody;
}

/**
 * Get streaming URL for media playback
 */
export async function getStreamingUrl(fileId: string): Promise<string> {
  try {
    const accessToken = getAccessToken();
    
    // For video/audio files, use the media alt endpoint for streaming
    return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&access_token=${accessToken}`;
  } catch (error: any) {
    console.error('Get streaming URL error:', error);
    throw new Error('Failed to get streaming URL');
  }
}

/**
 * Check if file is playable (video/audio)
 */
export function isPlayableMedia(mimeType: string): boolean {
  const playableTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/m4a',
  ];
  return playableTypes.includes(mimeType);
}

/**
 * Save Google Drive config to localStorage
 */
export function saveGoogleDriveConfig(config: GoogleDriveConfig): void {
  localStorage.setItem('googleDriveConfig', JSON.stringify(config));
}

/**
 * Load Google Drive config from localStorage
 */
export function loadGoogleDriveConfig(): GoogleDriveConfig | null {
  const config = localStorage.getItem('googleDriveConfig');
  return config ? JSON.parse(config) : null;
}

/**
 * Clear Google Drive config
 */
export function clearGoogleDriveConfig(): void {
  localStorage.removeItem('googleDriveConfig');
}
