// Individual note editing page
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { SearchModal } from '@/components/layout/SearchModal';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { AIAssistModal } from '@/components/ai/AIAssistModal';
import { DiagramPage } from './DiagramPage';
import { useNotes } from '@/hooks/useNotes';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useNotesStore } from '@/lib/store/useNotesStore';
import { getNote, updateNote, deleteNote as deleteNoteFirebase } from '@/lib/firebase/notes';
import { signOut } from '@/lib/firebase/auth';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Note } from '@/lib/types';

export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const notes = useNotes();
  const { user, logout } = useAuthStore();
  const { currentNote, setCurrentNote, updateNote: updateNoteStore, removeNote } = useNotesStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [aiAction, setAiAction] = useState('');
  useTheme();

  const noteId = params.id as string;

  useEffect(() => {
    const loadNote = async () => {
      setLoading(true);
      try {
        const note = await getNote(noteId);
        if (note) {
          setCurrentNote(note);
        } else {
          toast.error('Note not found');
          router.push('/dashboard');
        }
      } catch (error) {
        toast.error('Failed to load note');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [noteId, setCurrentNote, router]);

  const handleContentChange = async (content: any) => {
    if (!currentNote) return;

    setSaving(true);
    try {
      await updateNote(currentNote.id, { content });
      updateNoteStore(currentNote.id, { content });
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = async (title: string) => {
    if (!currentNote) return;

    try {
      await updateNote(currentNote.id, { title });
      updateNoteStore(currentNote.id, { title });
      setCurrentNote({ ...currentNote, title });
    } catch (error) {
      toast.error('Failed to update title');
    }
  };

  const handleDeleteNote = async () => {
    if (!currentNote) return;

    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNoteFirebase(currentNote.id);
        removeNote(currentNote.id);
        toast.success('Note deleted');
        router.push('/dashboard');
      } catch (error) {
        toast.error('Failed to delete note');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      logout();
      router.push('/auth/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleAIAction = (action: string, text: string) => {
    setAiAction(action);
    setSelectedText(text);
    setAiModalOpen(true);
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="flex h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      </AuthGuard>
    );
  }

  if (!currentNote) {
    return null;
  }

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar notes={notes} currentNoteId={noteId} />

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile Header */}
          <MobileHeader 
            title={currentNote?.title || 'Note'} 
            notes={notes}
            currentNoteId={noteId}
            onAction={handleSignOut}
            actionLabel="Logout"
          />

          {/* Desktop Top bar */}
          <div className="hidden lg:flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-1 items-center gap-2 sm:gap-4">
              <input
                type="text"
                value={currentNote.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="flex-1 border-none bg-transparent text-base sm:text-lg font-semibold text-gray-900 outline-none dark:text-white"
                placeholder="Untitled"
              />
              {saving && <span className="text-xs sm:text-sm text-gray-500">Saving...</span>}
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteNote}
                className="text-red-600 hover:bg-red-50 dark:text-red-400"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
              <ThemeToggle />
              <div className="hidden md:block text-sm text-gray-600 dark:text-gray-400">
                {user?.displayName || user?.email}
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden sm:flex">
                Logout
              </Button>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-hidden bg-white dark:bg-gray-900">
            {['flowchart', 'mindmap', 'whiteboard', 'mermaid_diagram'].includes(currentNote.type) ? (
              <DiagramPage note={currentNote} onContentChange={handleContentChange} />
            ) : (
              <TiptapEditor
                content={currentNote.content}
                onChange={handleContentChange}
                onAIAction={handleAIAction}
              />
            )}
          </div>
        </div>

        <SearchModal />
        <AIAssistModal
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          text={selectedText}
          action={aiAction}
          noteId={currentNote.id}
        />
      </div>
    </AuthGuard>
  );
}
