/**
 * Guest Storage - Local storage for non-authenticated users
 * Stores notes in browser's localStorage until user creates account
 */

import { Note } from './types';

const GUEST_NOTES_KEY = 'cogninote_guest_notes';
const GUEST_NOTE_ID_KEY = 'cogninote_guest_note_id_counter';

/**
 * Generate a temporary guest note ID
 */
function generateGuestNoteId(): string {
  const counter = parseInt(localStorage.getItem(GUEST_NOTE_ID_KEY) || '0', 10);
  const newCounter = counter + 1;
  localStorage.setItem(GUEST_NOTE_ID_KEY, newCounter.toString());
  return `guest-note-${newCounter}-${Date.now()}`;
}

/**
 * Get all guest notes from localStorage
 */
export function getGuestNotes(): Note[] {
  try {
    const notesJson = localStorage.getItem(GUEST_NOTES_KEY);
    if (!notesJson) return [];
    return JSON.parse(notesJson) as Note[];
  } catch (error) {
    console.error('Error loading guest notes:', error);
    return [];
  }
}

/**
 * Get a single guest note by ID
 */
export function getGuestNote(noteId: string): Note | null {
  const notes = getGuestNotes();
  return notes.find(note => note.id === noteId) || null;
}

/**
 * Save a guest note to localStorage
 */
export function saveGuestNote(note: Partial<Note>): Note {
  const notes = getGuestNotes();
  
  // If note has ID, update existing
  if (note.id) {
    const index = notes.findIndex(n => n.id === note.id);
    if (index !== -1) {
      notes[index] = {
        ...notes[index],
        ...note,
        updatedAt: new Date().toISOString(),
      } as Note;
      localStorage.setItem(GUEST_NOTES_KEY, JSON.stringify(notes));
      return notes[index];
    }
  }
  
  // Create new note
  const newNote: Note = {
    id: generateGuestNoteId(),
    userId: 'guest',
    title: note.title || 'Untitled',
    content: note.content || { type: 'doc', content: [{ type: 'paragraph' }] },
    type: note.type || 'document',
    parentNoteId: note.parentNoteId || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: false,
  };
  
  notes.push(newNote);
  localStorage.setItem(GUEST_NOTES_KEY, JSON.stringify(notes));
  return newNote;
}

/**
 * Delete a guest note
 */
export function deleteGuestNote(noteId: string): void {
  const notes = getGuestNotes();
  const filtered = notes.filter(note => note.id !== noteId);
  localStorage.setItem(GUEST_NOTES_KEY, JSON.stringify(filtered));
}

/**
 * Clear all guest notes (used after account creation and migration)
 */
export function clearGuestNotes(): void {
  localStorage.removeItem(GUEST_NOTES_KEY);
  localStorage.removeItem(GUEST_NOTE_ID_KEY);
}

/**
 * Check if there are any guest notes to migrate
 */
export function hasGuestNotes(): boolean {
  const notes = getGuestNotes();
  return notes.length > 0;
}

/**
 * Get guest notes count
 */
export function getGuestNotesCount(): number {
  return getGuestNotes().length;
}

/**
 * Migrate guest notes to user account
 * This should be called after user creates account
 */
export async function migrateGuestNotesToAccount(
  userId: string,
  saveNote: (note: Partial<Note>) => Promise<Note>
): Promise<{ success: number; failed: number }> {
  const guestNotes = getGuestNotes();
  let success = 0;
  let failed = 0;
  
  for (const guestNote of guestNotes) {
    try {
      // Create new note in backend with user's ID
      await saveNote({
        title: guestNote.title,
        content: guestNote.content,
        type: guestNote.type,
        parentNoteId: null, // Reset hierarchy for migrated notes
      });
      success++;
    } catch (error) {
      console.error('Failed to migrate note:', error);
      failed++;
    }
  }
  
  // Clear guest notes after successful migration
  if (success > 0) {
    clearGuestNotes();
  }
  
  return { success, failed };
}
