/**
 * Real-time Collaborative Editing
 * Sync document changes across users in real-time
 */

import { 
  getFirestore, 
  doc, 
  onSnapshot, 
  updateDoc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { Editor } from '@tiptap/react';

export interface CollaborativeUpdate {
  userId: string;
  userName: string;
  content: any; // Tiptap JSON
  version: number;
  timestamp: Timestamp;
}

export interface NoteSnapshot {
  content: any;
  version: number;
  lastModifiedBy: string;
  lastModifiedAt: Timestamp;
}

/**
 * Sync editor content to Firestore
 */
export async function syncEditorContent(
  noteId: string,
  userId: string,
  userName: string,
  content: any,
  version: number
): Promise<void> {
  const db = getFirestore();
  const noteRef = doc(db, 'notes', noteId);

  await updateDoc(noteRef, {
    content,
    version,
    lastModifiedBy: userId,
    lastModifiedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Subscribe to real-time note updates
 */
export function subscribeToNoteUpdates(
  noteId: string,
  currentUserId: string,
  onUpdate: (snapshot: NoteSnapshot) => void
): () => void {
  const db = getFirestore();
  const noteRef = doc(db, 'notes', noteId);

  const unsubscribe = onSnapshot(noteRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      
      // Only trigger update if it's from another user
      if (data.lastModifiedBy !== currentUserId) {
        onUpdate({
          content: data.content,
          version: data.version || 0,
          lastModifiedBy: data.lastModifiedBy,
          lastModifiedAt: data.lastModifiedAt,
        });
      }
    }
  });

  return unsubscribe;
}

/**
 * Debounced sync for editor
 */
export class CollaborativeEditor {
  private editor: Editor | null = null;
  private noteId: string;
  private userId: string;
  private userName: string;
  private version: number = 0;
  private syncTimeout?: NodeJS.Timeout;
  private unsubscribe?: () => void;
  private isUpdating: boolean = false;

  constructor(noteId: string, userId: string, userName: string) {
    this.noteId = noteId;
    this.userId = userId;
    this.userName = userName;
  }

  setEditor(editor: Editor) {
    this.editor = editor;
  }

  /**
   * Start collaborative session
   */
  startCollaboration() {
    if (!this.editor) return;

    // Subscribe to remote updates
    this.unsubscribe = subscribeToNoteUpdates(
      this.noteId,
      this.userId,
      (snapshot) => {
        this.handleRemoteUpdate(snapshot);
      }
    );

    // Listen to local changes
    this.editor.on('update', () => {
      this.handleLocalUpdate();
    });
  }

  /**
   * Handle local editor changes
   */
  private handleLocalUpdate() {
    if (!this.editor || this.isUpdating) return;

    // Debounce sync
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
    }

    this.syncTimeout = setTimeout(() => {
      this.sync();
    }, 1000); // Sync after 1 second of inactivity
  }

  /**
   * Handle remote updates from other users
   */
  private handleRemoteUpdate(snapshot: NoteSnapshot) {
    if (!this.editor || this.isUpdating) return;

    // Check if remote version is newer
    if (snapshot.version > this.version) {
      this.isUpdating = true;
      
      // Update editor content without triggering local update
      this.editor.commands.setContent(snapshot.content, false);
      this.version = snapshot.version;

      this.isUpdating = false;
    }
  }

  /**
   * Sync current content to Firestore
   */
  async sync() {
    if (!this.editor) return;

    const content = this.editor.getJSON();
    this.version++;

    await syncEditorContent(
      this.noteId,
      this.userId,
      this.userName,
      content,
      this.version
    );
  }

  /**
   * Force immediate sync
   */
  async forceSync() {
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
    }
    await this.sync();
  }

  /**
   * Stop collaboration
   */
  stopCollaboration() {
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
    }
    
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    // Final sync
    this.forceSync();
  }
}
