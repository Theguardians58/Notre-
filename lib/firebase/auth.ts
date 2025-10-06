// Firebase Authentication utilities
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { User, UserSettings } from '../types';

const googleProvider = new GoogleAuthProvider();

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  // Update profile with display name
  await updateProfile(firebaseUser, { displayName });

  // Create user document in Firestore
  const newUser: Omit<User, 'id'> = {
    email: firebaseUser.email!,
    displayName,
    settings: {
      defaultAIProvider: 'gemini',
      theme: 'system',
      apiKeys: {},
    },
    encryption: {
      enabled: false,
      salt: '',
      passwordHash: '',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDoc(doc(db, 'users', firebaseUser.uid), {
    ...newUser,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { ...newUser, id: firebaseUser.uid };
};

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return await getUserData(userCredential.user.uid);
};

export const signInWithGoogle = async (): Promise<User> => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const firebaseUser = userCredential.user;

  // Check if user document exists
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

  if (!userDoc.exists()) {
    // Create new user document
    const newUser: Omit<User, 'id'> = {
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName || 'User',
      photoURL: firebaseUser.photoURL || undefined,
      settings: {
        defaultAIProvider: 'gemini',
        theme: 'system',
        apiKeys: {},
      },
      encryption: {
        enabled: false,
        salt: '',
        passwordHash: '',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...newUser,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { ...newUser, id: firebaseUser.uid };
  }

  return await getUserData(firebaseUser.uid);
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export const getUserData = async (userId: string): Promise<User> => {
  const userDoc = await getDoc(doc(db, 'users', userId));

  if (!userDoc.exists()) {
    throw new Error('User not found');
  }

  const data = userDoc.data();
  return {
    id: userDoc.id,
    email: data.email,
    displayName: data.displayName,
    photoURL: data.photoURL,
    settings: data.settings || {
      defaultAIProvider: 'gemini',
      theme: 'system',
      apiKeys: {},
    },
    encryption: data.encryption || {
      enabled: false,
      salt: '',
      passwordHash: '',
    },
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
