// Sidebar with note navigation
'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  DocumentTextIcon,
  FolderIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { Note, DocumentType } from '@/lib/types';
import { createNote } from '@/lib/firebase/notes';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useNotesStore } from '@/lib/store/useNotesStore';
import { useUIStore } from '@/lib/store/useUIStore';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface SidebarProps {
  notes: Note[];
  currentNoteId?: string;
}

export const Sidebar: FC<SidebarProps> = ({ notes, currentNoteId }) => {
  const { user } = useAuthStore();
  const { addNote } = useNotesStore();
  const { toggleSearch } = useUIStore();
  const router = useRouter();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const handleCreateNote = async (type: DocumentType = 'document', parentId: string | null = null) => {
    if (!user) return;

    try {
      const note = await createNote(
        user.id,
        'Untitled',
        type,
        parentId
      );
      addNote(note);
      router.push(`/note/${note.id}`);
      toast.success('Note created');
    } catch (error) {
      toast.error('Failed to create note');
    }
  };

  const toggleFolder = (noteId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(noteId)) {
      newExpanded.delete(noteId);
    } else {
      newExpanded.add(noteId);
    }
    setExpandedFolders(newExpanded);
  };

  // Build tree structure
  const rootNotes = notes.filter((note) => !note.parentNoteId);

  const renderNoteTree = (note: Note, level = 0) => {
    const hasChildren = note.children && note.children.length > 0;
    const isExpanded = expandedFolders.has(note.id);
    const isActive = currentNoteId === note.id;

    return (
      <div key={note.id}>
        <Link
          href={`/note/${note.id}`}
          className={clsx(
            'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
            {
              'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100': isActive,
              'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800':
                !isActive,
            }
          )}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleFolder(note.id);
              }}
              className="hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isExpanded ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
            </button>
          )}
          {!hasChildren && <DocumentTextIcon className="h-4 w-4" />}
          <span className="flex-1 truncate">{note.emoji} {note.title}</span>
        </Link>

        {hasChildren && isExpanded && (
          <div>
            {note.children?.map((childId) => {
              const childNote = notes.find((n) => n.id === childId);
              return childNote ? renderNoteTree(childNote, level + 1) : null;
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="hidden lg:flex h-screen w-64 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">CogniNote</h1>
      </div>

      {/* Actions */}
      <div className="border-b border-gray-200 p-3 dark:border-gray-700">
        <button
          onClick={toggleSearch}
          className="mb-2 flex w-full items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-gray-600 shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
          Search...
        </button>

        <button
          onClick={() => handleCreateNote()}
          className="flex w-full items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          New Note
        </button>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {rootNotes.map((note) => renderNoteTree(note))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-3 dark:border-gray-700">
        <Link
          href="/settings"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <Cog6ToothIcon className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </div>
  );
};
