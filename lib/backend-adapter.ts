/**
 * Backend Adapter
 * Abstraction layer to switch between Firebase and Appwrite
 */

import { Note } from './types';

// Backend type
export type BackendType = 'firebase' | 'appwrite';

// Get current backend from environment
export function getCurrentBackend(): BackendType {
  const backend = process.env.NEXT_PUBLIC_BACKEND || 'firebase';
  return backend as BackendType;
}

// Auth operations interface
export interface AuthOperations {
  signUpWithEmail: (email: string, password: string, name: string) => Promise<any>;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  getCurrentUser: () => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (name: string) => Promise<any>;
  sendPasswordRecovery: (email: string) => Promise<void>;
}

// Database operations interface
export interface DatabaseOperations {
  createNote: (userId: string, note: Partial<Note>) => Promise<Note>;
  getNote: (noteId: string) => Promise<Note | null>;
  getNotes: (userId: string) => Promise<Note[]>;
  updateNote: (noteId: string, updates: Partial<Note>) => Promise<Note>;
  deleteNote: (noteId: string) => Promise<void>;
  searchNotes: (userId: string, searchTerm: string) => Promise<Note[]>;
  subscribeToNoteUpdates?: (noteId: string, callback: (note: Note) => void) => () => void;
}

// Storage operations interface
export interface StorageOperations {
  uploadFile: (file: File | Blob, path?: string) => Promise<string>;
  uploadImage: (userId: string, file: File, noteId?: string) => Promise<string>;
  deleteFile: (fileUrl: string) => Promise<void>;
  getFileUrl?: (fileId: string) => string;
}

// Backend adapter class
export class BackendAdapter {
  private backend: BackendType;
  private authOps: AuthOperations | null = null;
  private dbOps: DatabaseOperations | null = null;
  private storageOps: StorageOperations | null = null;

  constructor(backend?: BackendType) {
    this.backend = backend || getCurrentBackend();
  }

  /**
   * Initialize the adapter
   */
  async initialize(): Promise<void> {
    if (this.backend === 'firebase') {
      // Lazy load Firebase
      const firebaseAuth = await import('./firebase/auth');
      const firebaseDb = await import('./firebase/notes');
      const firebaseStorage = await import('./firebase/storage');

      this.authOps = {
        signUpWithEmail: firebaseAuth.signUpWithEmail,
        signInWithEmail: firebaseAuth.signInWithEmail,
        signInWithGoogle: firebaseAuth.signInWithGoogle,
        getCurrentUser: async () => {
          // Firebase doesn't have a direct getCurrentUser, use auth state
          const auth = await import('firebase/auth');
          const { auth: firebaseAuthInstance } = await import('./firebase/config');
          const currentUser = auth.getAuth().currentUser;
          if (currentUser) {
            return firebaseAuth.getUserData(currentUser.uid);
          }
          return null;
        },
        signOut: firebaseAuth.signOut,
        updateProfile: async (name: string) => {
          // Firebase update profile - placeholder
          return null;
        },
        sendPasswordRecovery: async (email: string) => {
          // Firebase password recovery - placeholder
        },
      };

      this.dbOps = {
        createNote: async (userId: string, note: Partial<Note>) => {
          return firebaseDb.createNote(
            userId,
            note.title || 'Untitled',
            note.type || 'document',
            note.parentNoteId || null,
            note.content
          );
        },
        getNote: firebaseDb.getNote,
        getNotes: firebaseDb.getNotes,
        updateNote: firebaseDb.updateNote,
        deleteNote: firebaseDb.deleteNote,
        searchNotes: firebaseDb.searchNotes,
        subscribeToNoteUpdates: async (noteId: string, callback: (note: any) => void) => {
          // Firebase notes doesn't have this function, placeholder
          return () => {};
        },
      };

      this.storageOps = {
        uploadFile: firebaseStorage.uploadFile,
        uploadImage: firebaseStorage.uploadImage,
        deleteFile: firebaseStorage.deleteFile,
      };
    } else if (this.backend === 'appwrite') {
      // Lazy load Appwrite
      const appwriteAuth = await import('./appwrite/auth');
      const appwriteDb = await import('./appwrite/database');
      const appwriteStorage = await import('./appwrite/storage');

      this.authOps = {
        signUpWithEmail: appwriteAuth.signUpWithEmail,
        signInWithEmail: appwriteAuth.signInWithEmail,
        signInWithGoogle: appwriteAuth.signInWithGoogle,
        getCurrentUser: appwriteAuth.getCurrentUser,
        signOut: appwriteAuth.signOut,
        updateProfile: appwriteAuth.updateProfile,
        sendPasswordRecovery: appwriteAuth.sendPasswordRecovery,
      };

      this.dbOps = {
        createNote: appwriteDb.createNote,
        getNote: appwriteDb.getNote,
        getNotes: appwriteDb.getNotes,
        updateNote: appwriteDb.updateNote,
        deleteNote: appwriteDb.deleteNote,
        searchNotes: appwriteDb.searchNotes,
        subscribeToNoteUpdates: appwriteDb.subscribeToNoteUpdates,
      };

      this.storageOps = {
        uploadFile: appwriteStorage.uploadFile,
        uploadImage: appwriteStorage.uploadImage,
        deleteFile: appwriteStorage.deleteFile,
        getFileUrl: appwriteStorage.getFileUrl,
      };
    }
  }

  // Auth methods
  get auth(): AuthOperations {
    if (!this.authOps) {
      throw new Error('Backend adapter not initialized. Call initialize() first.');
    }
    return this.authOps;
  }

  // Database methods
  get database(): DatabaseOperations {
    if (!this.dbOps) {
      throw new Error('Backend adapter not initialized. Call initialize() first.');
    }
    return this.dbOps;
  }

  // Storage methods
  get storage(): StorageOperations {
    if (!this.storageOps) {
      throw new Error('Backend adapter not initialized. Call initialize() first.');
    }
    return this.storageOps;
  }

  // Get current backend
  getBackendType(): BackendType {
    return this.backend;
  }

  // Check if backend is configured
  isConfigured(): boolean {
    if (this.backend === 'firebase') {
      return !!(
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      );
    } else if (this.backend === 'appwrite') {
      return !!(
        process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID &&
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
      );
    }
    return false;
  }
}

// Create singleton instance
let adapterInstance: BackendAdapter | null = null;

/**
 * Get backend adapter instance
 */
export async function getBackendAdapter(): Promise<BackendAdapter> {
  if (!adapterInstance) {
    adapterInstance = new BackendAdapter();
    await adapterInstance.initialize();
  }
  return adapterInstance;
}

/**
 * Switch backend (for testing or migration)
 */
export async function switchBackend(backend: BackendType): Promise<BackendAdapter> {
  adapterInstance = new BackendAdapter(backend);
  await adapterInstance.initialize();
  return adapterInstance;
}
