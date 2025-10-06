// Global notes state management with Zustand
import { create } from 'zustand';
import { Note } from '../types';

interface NotesState {
  notes: Note[];
  currentNote: Note | null;
  setNotes: (notes: Note[]) => void;
  setCurrentNote: (note: Note | null) => void;
  addNote: (note: Note) => void;
  updateNote: (noteId: string, updates: Partial<Note>) => void;
  removeNote: (noteId: string) => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  currentNote: null,
  setNotes: (notes) => set({ notes }),
  setCurrentNote: (note) => set({ currentNote: note }),
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  updateNote: (noteId, updates) =>
    set((state) => ({
      notes: state.notes.map((note) => (note.id === noteId ? { ...note, ...updates } : note)),
      currentNote:
        state.currentNote?.id === noteId
          ? { ...state.currentNote, ...updates }
          : state.currentNote,
    })),
  removeNote: (noteId) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== noteId),
      currentNote: state.currentNote?.id === noteId ? null : state.currentNote,
    })),
}));
