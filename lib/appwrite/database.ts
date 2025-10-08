/**
 * Appwrite Database Operations
 */

import { ID, Query, Models } from 'appwrite';
import { databases, appwrite } from './config';
import { Note } from '@/lib/types';

const { databaseId, notesCollectionId } = appwrite.config;

/**
 * Create a new note
 */
export async function createNote(userId: string, note: Partial<Note>): Promise<Note> {
  try {
    const document = await databases.createDocument(
      databaseId,
      notesCollectionId,
      ID.unique(),
      {
        title: note.title || 'Untitled',
        content: note.content || {},
        type: note.type || 'document',
        ownerId: userId,
        parentNoteId: note.parentNoteId || null,
        emoji: note.emoji || '📄',
        encrypted: note.encrypted || false,
        iv: note.iv || null,
        tags: note.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );

    return convertDocumentToNote(document);
  } catch (error: any) {
    console.error('Appwrite create note error:', error);
    throw new Error(error.message || 'Failed to create note');
  }
}

/**
 * Get a note by ID
 */
export async function getNote(noteId: string): Promise<Note | null> {
  try {
    const document = await databases.getDocument(
      databaseId,
      notesCollectionId,
      noteId
    );

    return convertDocumentToNote(document);
  } catch (error: any) {
    console.error('Appwrite get note error:', error);
    return null;
  }
}

/**
 * Get all notes for a user
 */
export async function getNotes(userId: string): Promise<Note[]> {
  try {
    const response = await databases.listDocuments(
      databaseId,
      notesCollectionId,
      [
        Query.equal('ownerId', userId),
        Query.orderDesc('updatedAt'),
        Query.limit(100),
      ]
    );

    return response.documents.map(convertDocumentToNote);
  } catch (error: any) {
    console.error('Appwrite get notes error:', error);
    return [];
  }
}

/**
 * Update a note
 */
export async function updateNote(noteId: string, updates: Partial<Note>): Promise<Note> {
  try {
    const updateData: any = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const document = await databases.updateDocument(
      databaseId,
      notesCollectionId,
      noteId,
      updateData
    );

    return convertDocumentToNote(document);
  } catch (error: any) {
    console.error('Appwrite update note error:', error);
    throw new Error(error.message || 'Failed to update note');
  }
}

/**
 * Delete a note
 */
export async function deleteNote(noteId: string): Promise<void> {
  try {
    await databases.deleteDocument(
      databaseId,
      notesCollectionId,
      noteId
    );
  } catch (error: any) {
    console.error('Appwrite delete note error:', error);
    throw new Error(error.message || 'Failed to delete note');
  }
}

/**
 * Search notes by title or content
 */
export async function searchNotes(userId: string, searchTerm: string): Promise<Note[]> {
  try {
    const response = await databases.listDocuments(
      databaseId,
      notesCollectionId,
      [
        Query.equal('ownerId', userId),
        Query.search('title', searchTerm),
        Query.limit(50),
      ]
    );

    return response.documents.map(convertDocumentToNote);
  } catch (error: any) {
    console.error('Appwrite search notes error:', error);
    return [];
  }
}

/**
 * Get child notes (for hierarchy)
 */
export async function getChildNotes(parentNoteId: string): Promise<Note[]> {
  try {
    const response = await databases.listDocuments(
      databaseId,
      notesCollectionId,
      [
        Query.equal('parentNoteId', parentNoteId),
        Query.orderDesc('updatedAt'),
      ]
    );

    return response.documents.map(convertDocumentToNote);
  } catch (error: any) {
    console.error('Appwrite get child notes error:', error);
    return [];
  }
}

/**
 * Get notes by type
 */
export async function getNotesByType(userId: string, type: string): Promise<Note[]> {
  try {
    const response = await databases.listDocuments(
      databaseId,
      notesCollectionId,
      [
        Query.equal('ownerId', userId),
        Query.equal('type', type),
        Query.orderDesc('updatedAt'),
      ]
    );

    return response.documents.map(convertDocumentToNote);
  } catch (error: any) {
    console.error('Appwrite get notes by type error:', error);
    return [];
  }
}

/**
 * Subscribe to note updates (real-time)
 */
export function subscribeToNoteUpdates(
  noteId: string,
  callback: (note: Note) => void
): () => void {
  const unsubscribe = appwrite.client.subscribe(
    `databases.${databaseId}.collections.${notesCollectionId}.documents.${noteId}`,
    (response: any) => {
      if (response.events.includes('databases.*.collections.*.documents.*.update')) {
        const note = convertDocumentToNote(response.payload);
        callback(note);
      }
    }
  );

  return () => {
    unsubscribe();
  };
}

/**
 * Subscribe to all notes updates for a user
 */
export function subscribeToNotesUpdates(
  userId: string,
  callback: (note: Note, event: string) => void
): () => void {
  const unsubscribe = appwrite.client.subscribe(
    `databases.${databaseId}.collections.${notesCollectionId}.documents`,
    (response: any) => {
      const note = convertDocumentToNote(response.payload);
      
      // Only notify for user's notes
      if (note.ownerId === userId) {
        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          callback(note, 'create');
        } else if (response.events.includes('databases.*.collections.*.documents.*.update')) {
          callback(note, 'update');
        } else if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
          callback(note, 'delete');
        }
      }
    }
  );

  return () => {
    unsubscribe();
  };
}

/**
 * Convert Appwrite document to Note type
 */
function convertDocumentToNote(document: Models.Document): Note {
  const doc = document as any;
  return {
    id: document.$id,
    title: doc.title,
    content: doc.content,
    type: doc.type,
    ownerId: doc.ownerId,
    parentNoteId: doc.parentNoteId,
    emoji: doc.emoji,
    encrypted: doc.encrypted || false,
    iv: doc.iv,
    tags: doc.tags || [],
    attachments: doc.attachments || [],
    isPublic: doc.isPublic || false,
    createdAt: new Date(document.$createdAt),
    updatedAt: new Date(document.$updatedAt),
  };
}
