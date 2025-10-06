// Firebase configuration and initialization
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (client-side only)
function getFirebaseApp(): FirebaseApp {
  if (typeof window === 'undefined') {
    throw new Error('Firebase can only be initialized on the client side');
  }
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!;
}

// Export getters instead of direct instances to avoid server-side issues
export const getFirebaseAuth = () => {
  const app = getFirebaseApp();
  return getAuth(app);
};

export const getFirebaseDb = () => {
  const app = getFirebaseApp();
  return getFirestore(app);
};

export const getFirebaseStorage = () => {
  const app = getFirebaseApp();
  return getStorage(app);
};

// For convenience, export instances (only used client-side)
export const auth = typeof window !== 'undefined' ? getFirebaseAuth() : ({} as Auth);
export const db = typeof window !== 'undefined' ? getFirebaseDb() : ({} as Firestore);
export const storage = typeof window !== 'undefined' ? getFirebaseStorage() : ({} as FirebaseStorage);
