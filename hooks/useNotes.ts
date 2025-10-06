// Notes hook with real-time sync
'use client';

import { useEffect } from 'react';
import { subscribeToUserNotes } from '@/lib/firebase/notes';
import { useNotesStore } from '@/lib/store/useNotesStore';
import { useAuthStore } from '@/lib/store/useAuthStore';

export const useNotes = () => {
  const { notes, setNotes } = useNotesStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }

    const unsubscribe = subscribeToUserNotes(user.id, (notes) => {
      setNotes(notes);
    });

    return () => unsubscribe();
  }, [user, setNotes]);

  return notes;
};
