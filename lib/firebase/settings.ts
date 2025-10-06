// User settings management
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { UserSettings, AIProvider } from '../types';

export const updateUserSettings = async (
  userId: string,
  settings: Partial<UserSettings>
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    settings,
    updatedAt: serverTimestamp(),
  });
};

export const updateAPIKey = async (
  userId: string,
  provider: AIProvider,
  apiKey: string
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    [`settings.apiKeys.${provider}`]: apiKey,
    updatedAt: serverTimestamp(),
  });
};

export const removeAPIKey = async (userId: string, provider: AIProvider): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    [`settings.apiKeys.${provider}`]: null,
    updatedAt: serverTimestamp(),
  });
};

export const setDefaultAIProvider = async (
  userId: string,
  provider: AIProvider
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    'settings.defaultAIProvider': provider,
    updatedAt: serverTimestamp(),
  });
};
