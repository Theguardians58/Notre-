// Encrypted note operations - wraps standard note operations with encryption
import { Note, DocumentType } from '../types';
import { 
  createNote as createNotePlain,
  getNote as getNotePlain,
  updateNote as updateNotePlain,
  getUserNotes as getUserNotesPlain,
} from './notes';
import { encryptJSON, decryptJSON } from '../crypto/encryption';
import { useEncryptionStore } from '../store/useEncryptionStore';

/**
 * Create an encrypted note
 */
export const createEncryptedNote = async (
  userId: string,
  title: string,
  type: DocumentType = 'document',
  parentNoteId: string | null = null,
  content?: any,
  encryptionKey?: CryptoKey
): Promise<Note> => {
  const key = encryptionKey || useEncryptionStore.getState().encryptionKey;
  
  if (!key) {
    throw new Error('Encryption key not available');
  }

  // Encrypt the content
  const contentToEncrypt = content || {
    type: 'doc',
    content: [{ type: 'paragraph' }],
  };

  const { ciphertext, iv } = await encryptJSON(contentToEncrypt, key);

  // Create note with encrypted content
  const note = await createNotePlain(userId, title, type, parentNoteId, {
    encrypted: true,
    data: ciphertext,
  });

  // Add encryption metadata
  const encryptedNote: Note = {
    ...note,
    encrypted: true,
    iv,
    content: contentToEncrypt, // Return decrypted content to caller
  };

  return encryptedNote;
};

/**
 * Get and decrypt a note
 */
export const getEncryptedNote = async (
  noteId: string,
  encryptionKey?: CryptoKey
): Promise<Note | null> => {
  const note = await getNotePlain(noteId);
  
  if (!note) {
    return null;
  }

  // If note is not encrypted, return as-is
  if (!note.encrypted || !note.iv) {
    return note;
  }

  const key = encryptionKey || useEncryptionStore.getState().encryptionKey;
  
  if (!key) {
    throw new Error('Encryption key required to decrypt note');
  }

  // Decrypt the content
  const decryptedContent = await decryptJSON(
    note.content.data,
    note.iv,
    key
  );

  return {
    ...note,
    content: decryptedContent,
  };
};

/**
 * Update an encrypted note
 */
export const updateEncryptedNote = async (
  noteId: string,
  updates: Partial<Omit<Note, 'id' | 'createdAt' | 'ownerId'>>,
  encryptionKey?: CryptoKey
): Promise<void> => {
  const key = encryptionKey || useEncryptionStore.getState().encryptionKey;

  // If updating content and encryption is enabled
  if (updates.content && key) {
    const { ciphertext, iv } = await encryptJSON(updates.content, key);
    
    await updateNotePlain(noteId, {
      ...updates,
      content: { encrypted: true, data: ciphertext },
      encrypted: true,
      iv,
    });
  } else {
    await updateNotePlain(noteId, updates);
  }
};

/**
 * Get all user notes and decrypt them
 */
export const getEncryptedUserNotes = async (
  userId: string,
  encryptionKey?: CryptoKey
): Promise<Note[]> => {
  const notes = await getUserNotesPlain(userId);
  const key = encryptionKey || useEncryptionStore.getState().encryptionKey;

  // Decrypt all encrypted notes
  const decryptedNotes = await Promise.all(
    notes.map(async (note) => {
      if (!note.encrypted || !note.iv || !key) {
        return note;
      }

      try {
        const decryptedContent = await decryptJSON(
          note.content.data,
          note.iv,
          key
        );

        return {
          ...note,
          content: decryptedContent,
        };
      } catch (error) {
        console.error('Failed to decrypt note:', note.id, error);
        // Return note with error indicator
        return {
          ...note,
          content: { error: 'Failed to decrypt' },
        };
      }
    })
  );

  return decryptedNotes;
};

/**
 * Encrypt existing plaintext notes (migration)
 */
export const encryptExistingNotes = async (
  userId: string,
  encryptionKey: CryptoKey
): Promise<void> => {
  const notes = await getUserNotesPlain(userId);

  for (const note of notes) {
    if (!note.encrypted && note.content) {
      const { ciphertext, iv } = await encryptJSON(note.content, encryptionKey);
      
      await updateNotePlain(note.id, {
        content: { encrypted: true, data: ciphertext },
        encrypted: true,
        iv,
      });
    }
  }
};
