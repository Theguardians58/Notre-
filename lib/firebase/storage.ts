// Firebase Storage utilities for file uploads
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadString,
} from 'firebase/storage';
import { storage } from './config';

export const uploadImage = async (
  userId: string,
  file: File,
  noteId?: string
): Promise<string> => {
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name}`;
  const path = noteId
    ? `users/${userId}/notes/${noteId}/images/${fileName}`
    : `users/${userId}/images/${fileName}`;

  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const uploadFile = async (
  userId: string,
  file: File,
  noteId?: string
): Promise<string> => {
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name}`;
  const path = noteId
    ? `users/${userId}/notes/${noteId}/files/${fileName}`
    : `users/${userId}/files/${fileName}`;

  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

// Parse imported files
export const parseTextFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const parseMarkdownFile = async (file: File): Promise<string> => {
  return parseTextFile(file);
};
