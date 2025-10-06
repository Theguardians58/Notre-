// Encryption status indicator
'use client';

import { FC } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useEncryptionStore } from '@/lib/store/useEncryptionStore';
import { ShieldCheckIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export const EncryptionStatus: FC = () => {
  const { user } = useAuthStore();
  const { isUnlocked } = useEncryptionStore();

  if (!user?.encryption?.enabled) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs dark:bg-gray-800">
        <ShieldCheckIcon className="h-4 w-4 text-gray-500" />
        <span className="text-gray-600 dark:text-gray-400">Not Encrypted</span>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs',
        isUnlocked
          ? 'bg-green-100 dark:bg-green-900/30'
          : 'bg-yellow-100 dark:bg-yellow-900/30'
      )}
    >
      {isUnlocked ? (
        <>
          <LockOpenIcon className="h-4 w-4 text-green-700 dark:text-green-400" />
          <span className="text-green-800 dark:text-green-300">Unlocked</span>
        </>
      ) : (
        <>
          <LockClosedIcon className="h-4 w-4 text-yellow-700 dark:text-yellow-400" />
          <span className="text-yellow-800 dark:text-yellow-300">Locked</span>
        </>
      )}
    </div>
  );
};
