// Firestore operations for notes
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';
import { Note, DocumentType } from '../types';

export const createNote = async (
  userId: string,
  title: string,
  type: DocumentType = 'document',
  parentNoteId: string | null = null,
  content?: any
): Promise<Note> => {
  const noteRef = doc(collection(db, 'notes'));

  const newNote: Omit<Note, 'id'> = {
    title,
    content: content || {
      type: 'doc',
      content: [{ type: 'paragraph' }],
    },
    type,
    ownerId: userId,
    parentNoteId,
    children: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
    isPublic: false,
    linkedNotes: [],
    backlinks: [],
  };

  await setDoc(noteRef, {
    ...newNote,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // If this note has a parent, update the parent's children array
  if (parentNoteId) {
    const parentRef = doc(db, 'notes', parentNoteId);
    const parentDoc = await getDoc(parentRef);
    if (parentDoc.exists()) {
      const parentData = parentDoc.data();
      const children = parentData.children || [];
      await updateDoc(parentRef, {
        children: [...children, noteRef.id],
        updatedAt: serverTimestamp(),
      });
    }
  }

  return { ...newNote, id: noteRef.id };
};

export const getNote = async (noteId: string): Promise<Note | null> => {
  const noteDoc = await getDoc(doc(db, 'notes', noteId));

  if (!noteDoc.exists()) {
    return null;
  }

  const data = noteDoc.data();
  return {
    id: noteDoc.id,
    title: data.title,
    content: data.content,
    type: data.type,
    ownerId: data.ownerId,
    parentNoteId: data.parentNoteId || null,
    children: data.children || [],
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    tags: data.tags || [],
    emoji: data.emoji,
    isPublic: data.isPublic || false,
    linkedNotes: data.linkedNotes || [],
    backlinks: data.backlinks || [],
  };
};

export const getUserNotes = async (userId: string): Promise<Note[]> => {
  const notesQuery = query(
    collection(db, 'notes'),
    where('ownerId', '==', userId),
    orderBy('updatedAt', 'desc')
  );

  const snapshot = await getDocs(notesQuery);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      content: data.content,
      type: data.type,
      ownerId: data.ownerId,
      parentNoteId: data.parentNoteId || null,
      children: data.children || [],
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      tags: data.tags || [],
      emoji: data.emoji,
      isPublic: data.isPublic || false,
      linkedNotes: data.linkedNotes || [],
      backlinks: data.backlinks || [],
    };
  });
};

export const updateNote = async (
  noteId: string,
  updates: Partial<Omit<Note, 'id' | 'createdAt' | 'ownerId'>>
): Promise<void> => {
  const noteRef = doc(db, 'notes', noteId);
  await updateDoc(noteRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteNote = async (noteId: string): Promise<void> => {
  const noteRef = doc(db, 'notes', noteId);
  const note = await getNote(noteId);

  if (!note) return;

  // Remove from parent's children array
  if (note.parentNoteId) {
    const parentRef = doc(db, 'notes', note.parentNoteId);
    const parentDoc = await getDoc(parentRef);
    if (parentDoc.exists()) {
      const parentData = parentDoc.data();
      const children = (parentData.children || []).filter((id: string) => id !== noteId);
      await updateDoc(parentRef, {
        children,
        updatedAt: serverTimestamp(),
      });
    }
  }

  // Delete all children recursively
  if (note.children && note.children.length > 0) {
    for (const childId of note.children) {
      await deleteNote(childId);
    }
  }

  await deleteDoc(noteRef);
};

export const subscribeToNote = (
  noteId: string,
  callback: (note: Note | null) => void
): (() => void) => {
  return onSnapshot(doc(db, 'notes', noteId), (doc) => {
    if (!doc.exists()) {
      callback(null);
      return;
    }

    const data = doc.data();
    callback({
      id: doc.id,
      title: data.title,
      content: data.content,
      type: data.type,
      ownerId: data.ownerId,
      parentNoteId: data.parentNoteId || null,
      children: data.children || [],
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      tags: data.tags || [],
      emoji: data.emoji,
      isPublic: data.isPublic || false,
      linkedNotes: data.linkedNotes || [],
      backlinks: data.backlinks || [],
    });
  });
};

export const subscribeToUserNotes = (
  userId: string,
  callback: (notes: Note[]) => void
): (() => void) => {
  const notesQuery = query(
    collection(db, 'notes'),
    where('ownerId', '==', userId),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(notesQuery, (snapshot) => {
    const notes = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        type: data.type,
        ownerId: data.ownerId,
        parentNoteId: data.parentNoteId || null,
        children: data.children || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        tags: data.tags || [],
        emoji: data.emoji,
        isPublic: data.isPublic || false,
        linkedNotes: data.linkedNotes || [],
        backlinks: data.backlinks || [],
      };
    });
    callback(notes);
  });
};

// Bi-directional linking
export const addLinkBetweenNotes = async (
  sourceNoteId: string,
  targetNoteId: string
): Promise<void> => {
  const batch = writeBatch(db);

  const sourceRef = doc(db, 'notes', sourceNoteId);
  const targetRef = doc(db, 'notes', targetNoteId);

  // Get current data
  const [sourceDoc, targetDoc] = await Promise.all([
    getDoc(sourceRef),
    getDoc(targetRef),
  ]);

  if (!sourceDoc.exists() || !targetDoc.exists()) return;

  const sourceData = sourceDoc.data();
  const targetData = targetDoc.data();

  // Add to source's linkedNotes
  const linkedNotes = new Set(sourceData.linkedNotes || []);
  linkedNotes.add(targetNoteId);

  // Add to target's backlinks
  const backlinks = new Set(targetData.backlinks || []);
  backlinks.add(sourceNoteId);

  batch.update(sourceRef, {
    linkedNotes: Array.from(linkedNotes),
    updatedAt: serverTimestamp(),
  });

  batch.update(targetRef, {
    backlinks: Array.from(backlinks),
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
};

export const removeLinkBetweenNotes = async (
  sourceNoteId: string,
  targetNoteId: string
): Promise<void> => {
  const batch = writeBatch(db);

  const sourceRef = doc(db, 'notes', sourceNoteId);
  const targetRef = doc(db, 'notes', targetNoteId);

  const [sourceDoc, targetDoc] = await Promise.all([
    getDoc(sourceRef),
    getDoc(targetRef),
  ]);

  if (!sourceDoc.exists() || !targetDoc.exists()) return;

  const sourceData = sourceDoc.data();
  const targetData = targetDoc.data();

  // Remove from source's linkedNotes
  const linkedNotes = (sourceData.linkedNotes || []).filter(
    (id: string) => id !== targetNoteId
  );

  // Remove from target's backlinks
  const backlinks = (targetData.backlinks || []).filter((id: string) => id !== sourceNoteId);

  batch.update(sourceRef, {
    linkedNotes,
    updatedAt: serverTimestamp(),
  });

  batch.update(targetRef, {
    backlinks,
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
};
