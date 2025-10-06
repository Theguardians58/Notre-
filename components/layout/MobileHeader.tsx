// Mobile header with hamburger menu
'use client';

import { FC, useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { ThemeToggle } from './ThemeToggle';
import { EncryptionStatus } from '@/components/encryption/EncryptionStatus';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { MobileSidebar } from './MobileSidebar';
import { Note } from '@/lib/types';

interface MobileHeaderProps {
  title?: string;
  notes: Note[];
  currentNoteId?: string;
  onAction?: () => void;
  actionLabel?: string;
  showEncryption?: boolean;
}

export const MobileHeader: FC<MobileHeaderProps> = ({
  title = 'CogniNote',
  notes,
  currentNoteId,
  onAction,
  actionLabel,
  showEncryption = true,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <>
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300"
          onClick={() => setSidebarOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="flex flex-1 items-center justify-between gap-x-4">
          <h1 className="truncate text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>

          <div className="flex items-center gap-2">
            {showEncryption && <EncryptionStatus />}
            <ThemeToggle />
            {onAction && actionLabel && (
              <Button onClick={onAction} size="sm" variant="ghost" className="hidden sm:flex">
                {actionLabel}
              </Button>
            )}
          </div>
        </div>
      </div>

      <MobileSidebar
        notes={notes}
        currentNoteId={currentNoteId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
};
