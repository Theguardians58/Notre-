// Global search modal
'use client';

import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useUIStore } from '@/lib/store/useUIStore';
import { useNotesStore } from '@/lib/store/useNotesStore';
import { searchNotes } from '@/lib/search';

export const SearchModal: FC = () => {
  const { searchOpen, toggleSearch } = useUIStore();
  const { notes } = useNotesStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchNotes(notes, query);
      setResults(searchResults.slice(0, 10)); // Limit to 10 results
    } else {
      setResults([]);
    }
  }, [query, notes]);

  const handleSelectNote = (noteId: string) => {
    router.push(`/note/${noteId}`);
    toggleSearch();
    setQuery('');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
      if (e.key === 'Escape' && searchOpen) {
        toggleSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, toggleSearch]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-4 sm:pt-20 px-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-2xl dark:bg-gray-800">
        <div className="flex items-center border-b border-gray-200 p-3 sm:p-4 dark:border-gray-700">
          <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="ml-2 sm:ml-3 flex-1 bg-transparent text-sm sm:text-base text-gray-900 outline-none dark:text-white"
          />
          <button
            onClick={toggleSearch}
            className="rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 touch-manipulation"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-60 sm:max-h-96 overflow-y-auto p-2">
          {results.length > 0 ? (
            results.map((result) => (
              <button
                key={result.noteId}
                onClick={() => handleSelectNote(result.noteId)}
                className="w-full rounded-lg p-2 sm:p-3 text-left transition-colors hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-600 touch-manipulation"
              >
                <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{result.title}</div>
                {result.excerpt && (
                  <div className="mt-1 line-clamp-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {result.excerpt}
                  </div>
                )}
              </button>
            ))
          ) : query ? (
            <div className="p-6 sm:p-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No notes found
            </div>
          ) : (
            <div className="p-6 sm:p-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Start typing to search...
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-2 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
          <div className="flex items-center justify-between px-2">
            <span>Use ↑↓ to navigate</span>
            <span>⌘K to toggle</span>
          </div>
        </div>
      </div>
    </div>
  );
};
