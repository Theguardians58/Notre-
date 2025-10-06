// Mobile-friendly sidebar drawer
'use client';

import { FC, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  DocumentTextIcon,
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
import { useState } from 'react';

interface MobileSidebarProps {
  notes: Note[];
  currentNoteId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar: FC<MobileSidebarProps> = ({ 
  notes, 
  currentNoteId, 
  isOpen, 
  onClose 
}) => {
  const { user } = useAuthStore();
  const { addNote } = useNotesStore();
  const { toggleSearch } = useUIStore();
  const router = useRouter();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const handleCreateNote = async (type: DocumentType = 'document') => {
    if (!user) return;

    try {
      const note = await createNote(user.id, 'Untitled', type);
      addNote(note);
      router.push(`/note/${note.id}`);
      toast.success('Note created');
      onClose();
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

  const rootNotes = notes.filter((note) => !note.parentNoteId);

  const renderNoteTree = (note: Note, level = 0) => {
    const hasChildren = note.children && note.children.length > 0;
    const isExpanded = expandedFolders.has(note.id);
    const isActive = currentNoteId === note.id;

    return (
      <div key={note.id}>
        <Link
          href={`/note/${note.id}`}
          onClick={onClose}
          className={clsx(
            'flex items-center gap-2 rounded-lg px-3 py-3 text-sm transition-colors',
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
                e.stopPropagation();
                toggleFolder(note.id);
              }}
              className="hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isExpanded ? (
                <ChevronDownIcon className="h-5 w-5" />
              ) : (
                <ChevronRightIcon className="h-5 w-5" />
              )}
            </button>
          )}
          {!hasChildren && <DocumentTextIcon className="h-5 w-5" />}
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
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-50 px-6 pb-4 dark:bg-gray-900">
                {/* Header */}
                <div className="flex h-16 shrink-0 items-center justify-between">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">CogniNote</h1>
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      toggleSearch();
                      onClose();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg bg-white px-3 py-3 text-sm text-gray-600 shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5" />
                    Search...
                  </button>

                  <button
                    onClick={() => handleCreateNote()}
                    className="flex w-full items-center gap-2 rounded-lg bg-blue-600 px-3 py-3 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <PlusIcon className="h-5 w-5" />
                    New Note
                  </button>
                </div>

                {/* Notes List */}
                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-1">
                    {rootNotes.map((note) => renderNoteTree(note))}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
                  <Link
                    href="/settings"
                    onClick={onClose}
                    className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <Cog6ToothIcon className="h-5 w-5" />
                    Settings
                  </Link>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
