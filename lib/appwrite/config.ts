/**
 * Appwrite Configuration
 * Alternative backend to Firebase
 */

import { Client, Account, Databases, Storage, Teams } from 'appwrite';

// Appwrite configuration from environment variables
const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
  // Collection IDs
  notesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_NOTES_COLLECTION_ID || '',
  usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || '',
  presenceCollectionId: process.env.NEXT_PUBLIC_APPWRITE_PRESENCE_COLLECTION_ID || '',
  // Storage Bucket ID
  storageBucketId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || '',
};

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const teams = new Teams(client);

// Export config
export const appwrite = {
  client,
  account,
  databases,
  storage,
  teams,
  config: appwriteConfig,
};

// Helper to check if Appwrite is configured
export function isAppwriteConfigured(): boolean {
  return !!(
    appwriteConfig.projectId &&
    appwriteConfig.databaseId &&
    appwriteConfig.notesCollectionId
  );
}

export default appwrite;
