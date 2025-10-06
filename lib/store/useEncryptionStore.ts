// Encryption key state management
// Keys are stored in memory only, never persisted to disk
import { create } from 'zustand';

interface EncryptionState {
  encryptionKey: CryptoKey | null;
  isUnlocked: boolean;
  setEncryptionKey: (key: CryptoKey) => void;
  clearEncryptionKey: () => void;
  lock: () => void;
}

export const useEncryptionStore = create<EncryptionState>((set) => ({
  encryptionKey: null,
  isUnlocked: false,
  setEncryptionKey: (key) => set({ encryptionKey: key, isUnlocked: true }),
  clearEncryptionKey: () => set({ encryptionKey: null, isUnlocked: false }),
  lock: () => set({ encryptionKey: null, isUnlocked: false }),
}));
