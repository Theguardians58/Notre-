'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import dynamic from 'next/dynamic';
import { saveGuestNote, hasGuestNotes, getGuestNotesCount } from '@/lib/guest-storage';
import SavePromptModal from '@/components/SavePromptModal';
import { Spinner } from '@/components/ui/Spinner';

const TiptapEditor = dynamic(
  () => import('@/components/editor/TiptapEditor'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    ),
  }
);

export default function NewNotePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isGuest = searchParams.get('guest') === 'true';

  const [noteContent, setNoteContent] = useState<any>({ type: 'doc', content: [{ type: 'paragraph' }] });
  const [noteTitle, setNoteTitle] = useState('Untitled');
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save for guest users
  useEffect(() => {
    if (isGuest && !user) {
      const timer = setTimeout(() => {
        saveGuestNote({
          title: noteTitle,
          content: noteContent,
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [noteTitle, noteContent, isGuest, user]);

  // Show save prompt periodically for guests
  useEffect(() => {
    if (isGuest && !user && !authLoading) {
      const timer = setTimeout(() => {
        if (hasGuestNotes()) {
          setShowSavePrompt(true);
        }
      }, 30000); // Show after 30 seconds of use

      return () => clearTimeout(timer);
    }
  }, [isGuest, user, authLoading]);

  const handleContentChange = (content: any) => {
    setNoteContent(content);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoteTitle(e.target.value);
  };

  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Guest Banner */}
      {isGuest && !user && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">✨ Guest Mode</span>
              <span className="text-sm opacity-90">
                Your notes are saved locally. Create an account to save to cloud.
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSavePrompt(true)}
                className="px-4 py-1.5 bg-white text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
              >
                Create Account
              </button>
              <button
                onClick={handleLogin}
                className="px-4 py-1.5 bg-transparent border border-white text-white rounded-lg text-sm font-semibold hover:bg-white/10 transition"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <input
          type="text"
          value={noteTitle}
          onChange={handleTitleChange}
          placeholder="Untitled"
          className="w-full text-3xl font-bold bg-transparent border-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-400"
        />
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <TiptapEditor
          content={noteContent}
          onChange={handleContentChange}
          editable={true}
        />
      </div>

      {/* Save Prompt Modal */}
      <SavePromptModal
        isOpen={showSavePrompt}
        onClose={() => setShowSavePrompt(false)}
        onSignUp={handleSignUp}
        onLogin={handleLogin}
        noteCount={getGuestNotesCount()}
      />
    </div>
  );
}
