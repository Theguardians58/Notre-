/**
 * Supabase Database Operations
 */

import { supabase, tables } from './config';
import { Note } from '@/lib/types';

/**
 * Create a new note
 */
export async function createNote(userId: string, note: Partial<Note>): Promise<Note> {
  try {
    const { data, error } = await supabase
      .from(tables.notes)
      .insert({
        title: note.title || 'Untitled',
        content: note.content || {},
        type: note.type || 'document',
        owner_id: userId,
        parent_note_id: note.parentNoteId || null,
        emoji: note.emoji || '📄',
        encrypted: note.encrypted || false,
        iv: note.iv || null,
        tags: note.tags || [],
        attachments: note.attachments || [],
        is_public: note.isPublic || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return convertRowToNote(data);
  } catch (error: any) {
    console.error('Supabase create note error:', error);
    throw new Error(error.message || 'Failed to create note');
  }
}

/**
 * Get a note by ID
 */
export async function getNote(noteId: string): Promise<Note | null> {
  try {
    const { data, error } = await supabase
      .from(tables.notes)
      .select('*')
      .eq('id', noteId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return convertRowToNote(data);
  } catch (error: any) {
    console.error('Supabase get note error:', error);
    return null;
  }
}

/**
 * Get all notes for a user
 */
export async function getNotes(userId: string): Promise<Note[]> {
  try {
    const { data, error } = await supabase
      .from(tables.notes)
      .select('*')
      .eq('owner_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return data.map(convertRowToNote);
  } catch (error: any) {
    console.error('Supabase get notes error:', error);
    return [];
  }
}

/**
 * Update a note
 */
export async function updateNote(noteId: string, updates: Partial<Note>): Promise<Note> {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Map Note fields to database columns
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.content !== undefined) updateData.content = updates.content;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.parentNoteId !== undefined) updateData.parent_note_id = updates.parentNoteId;
    if (updates.emoji !== undefined) updateData.emoji = updates.emoji;
    if (updates.encrypted !== undefined) updateData.encrypted = updates.encrypted;
    if (updates.iv !== undefined) updateData.iv = updates.iv;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if (updates.attachments !== undefined) updateData.attachments = updates.attachments;
    if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic;

    const { data, error } = await supabase
      .from(tables.notes)
      .update(updateData)
      .eq('id', noteId)
      .select()
      .single();

    if (error) throw error;

    return convertRowToNote(data);
  } catch (error: any) {
    console.error('Supabase update note error:', error);
    throw new Error(error.message || 'Failed to update note');
  }
}

/**
 * Delete a note
 */
export async function deleteNote(noteId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from(tables.notes)
      .delete()
      .eq('id', noteId);

    if (error) throw error;
  } catch (error: any) {
    console.error('Supabase delete note error:', error);
    throw new Error(error.message || 'Failed to delete note');
  }
}

/**
 * Search notes
 */
export async function searchNotes(userId: string, searchTerm: string): Promise<Note[]> {
  try {
    const { data, error } = await supabase
      .from(tables.notes)
      .select('*')
      .eq('owner_id', userId)
      .or(`title.ilike.%${searchTerm}%,content::text.ilike.%${searchTerm}%`)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return data.map(convertRowToNote);
  } catch (error: any) {
    console.error('Supabase search notes error:', error);
    return [];
  }
}

/**
 * Get child notes
 */
export async function getChildNotes(parentId: string): Promise<Note[]> {
  try {
    const { data, error } = await supabase
      .from(tables.notes)
      .select('*')
      .eq('parent_note_id', parentId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data.map(convertRowToNote);
  } catch (error: any) {
    console.error('Supabase get child notes error:', error);
    return [];
  }
}

/**
 * Get notes by type
 */
export async function getNotesByType(userId: string, type: string): Promise<Note[]> {
  try {
    const { data, error } = await supabase
      .from(tables.notes)
      .select('*')
      .eq('owner_id', userId)
      .eq('type', type)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return data.map(convertRowToNote);
  } catch (error: any) {
    console.error('Supabase get notes by type error:', error);
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
  const channel = supabase
    .channel(`note-${noteId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: tables.notes,
        filter: `id=eq.${noteId}`,
      },
      (payload) => {
        if (payload.new) {
          callback(convertRowToNote(payload.new));
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Subscribe to all notes updates (real-time)
 */
export function subscribeToNotesUpdates(
  userId: string,
  callback: (notes: Note[]) => void
): () => void {
  const channel = supabase
    .channel(`notes-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: tables.notes,
        filter: `owner_id=eq.${userId}`,
      },
      async () => {
        // Fetch all notes when any change occurs
        const notes = await getNotes(userId);
        callback(notes);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Convert database row to Note type
 */
function convertRowToNote(row: any): Note {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    type: row.type,
    ownerId: row.owner_id,
    parentNoteId: row.parent_note_id,
    emoji: row.emoji,
    encrypted: row.encrypted || false,
    iv: row.iv,
    tags: row.tags || [],
    attachments: row.attachments || [],
    isPublic: row.is_public || false,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}
