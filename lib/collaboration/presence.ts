/**
 * Real-time Presence System
 * Track who is currently viewing/editing notes
 */

import { 
  getFirestore, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  collection, 
  query, 
  where,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';

export interface UserPresence {
  userId: string;
  userName: string;
  userEmail: string;
  photoURL?: string;
  noteId: string;
  isEditing: boolean;
  lastActive: Timestamp;
  cursorPosition?: {
    from: number;
    to: number;
  };
  selection?: {
    from: number;
    to: number;
  };
  color: string; // User's assigned color for cursor/selection
}

const PRESENCE_TIMEOUT = 30000; // 30 seconds

/**
 * Generate a consistent color for a user
 */
export function getUserColor(userId: string): string {
  const colors = [
    '#ef4444', // red
    '#f59e0b', // amber
    '#10b981', // green
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
  ];
  
  // Simple hash to get consistent color for user
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Set user presence for a note
 */
export async function setUserPresence(
  userId: string,
  userName: string,
  userEmail: string,
  noteId: string,
  isEditing: boolean,
  photoURL?: string,
  cursorPosition?: { from: number; to: number }
): Promise<void> {
  const db = getFirestore();
  const presenceRef = doc(db, 'presence', `${noteId}_${userId}`);

  const presence: Partial<UserPresence> = {
    userId,
    userName,
    userEmail,
    photoURL,
    noteId,
    isEditing,
    lastActive: serverTimestamp() as Timestamp,
    color: getUserColor(userId),
  };

  if (cursorPosition) {
    presence.cursorPosition = cursorPosition;
  }

  await setDoc(presenceRef, presence, { merge: true });
}

/**
 * Remove user presence
 */
export async function removeUserPresence(noteId: string, userId: string): Promise<void> {
  const db = getFirestore();
  const presenceRef = doc(db, 'presence', `${noteId}_${userId}`);
  await deleteDoc(presenceRef);
}

/**
 * Subscribe to presence updates for a note
 */
export function subscribeToPresence(
  noteId: string,
  currentUserId: string,
  callback: (users: UserPresence[]) => void
): () => void {
  const db = getFirestore();
  const presenceQuery = query(
    collection(db, 'presence'),
    where('noteId', '==', noteId)
  );

  const unsubscribe = onSnapshot(presenceQuery, (snapshot) => {
    const now = Date.now();
    const activeUsers: UserPresence[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data() as UserPresence;
      
      // Filter out current user and inactive users
      if (data.userId !== currentUserId) {
        const lastActive = data.lastActive?.toMillis() || 0;
        if (now - lastActive < PRESENCE_TIMEOUT) {
          activeUsers.push(data);
        }
      }
    });

    callback(activeUsers);
  });

  return unsubscribe;
}

/**
 * Heartbeat to keep presence alive
 */
export class PresenceManager {
  private intervalId?: NodeJS.Timeout;
  private noteId: string;
  private userId: string;
  private userName: string;
  private userEmail: string;
  private photoURL?: string;

  constructor(
    noteId: string,
    userId: string,
    userName: string,
    userEmail: string,
    photoURL?: string
  ) {
    this.noteId = noteId;
    this.userId = userId;
    this.userName = userName;
    this.userEmail = userEmail;
    this.photoURL = photoURL;
  }

  start(isEditing: boolean = false) {
    // Set initial presence
    setUserPresence(
      this.userId,
      this.userName,
      this.userEmail,
      this.noteId,
      isEditing,
      this.photoURL
    );

    // Update presence every 10 seconds
    this.intervalId = setInterval(() => {
      setUserPresence(
        this.userId,
        this.userName,
        this.userEmail,
        this.noteId,
        isEditing,
        this.photoURL
      );
    }, 10000);

    // Clean up on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.stop());
    }
  }

  updateCursor(cursorPosition: { from: number; to: number }) {
    setUserPresence(
      this.userId,
      this.userName,
      this.userEmail,
      this.noteId,
      true,
      this.photoURL,
      cursorPosition
    );
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    removeUserPresence(this.noteId, this.userId);
  }
}
