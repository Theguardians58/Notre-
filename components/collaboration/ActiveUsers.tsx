'use client';

import { useEffect, useState } from 'react';
import { UserPresence, subscribeToPresence } from '@/lib/collaboration/presence';
import { useAuthStore } from '@/lib/store/useAuthStore';

interface ActiveUsersProps {
  noteId: string;
}

export default function ActiveUsers({ noteId }: ActiveUsersProps) {
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToPresence(noteId, user.id, (users) => {
      setActiveUsers(users);
    });

    return () => unsubscribe();
  }, [noteId, user]);

  if (activeUsers.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Viewing:
      </span>
      <div className="flex -space-x-2">
        {activeUsers.slice(0, 5).map((activeUser) => (
          <div
            key={activeUser.userId}
            className="relative group"
            title={`${activeUser.userName} ${activeUser.isEditing ? '(editing)' : '(viewing)'}`}
          >
            {activeUser.photoURL ? (
              <img
                src={activeUser.photoURL}
                alt={activeUser.userName}
                className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                style={{ borderColor: activeUser.color }}
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-semibold"
                style={{ 
                  backgroundColor: activeUser.color,
                  borderColor: activeUser.color 
                }}
              >
                {activeUser.userName.charAt(0).toUpperCase()}
              </div>
            )}
            
            {/* Editing indicator */}
            {activeUser.isEditing && (
              <div 
                className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800"
                style={{ backgroundColor: activeUser.color }}
              />
            )}

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {activeUser.userName}
              {activeUser.isEditing && ' (editing)'}
            </div>
          </div>
        ))}
        
        {activeUsers.length > 5 && (
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs font-semibold">
            +{activeUsers.length - 5}
          </div>
        )}
      </div>
    </div>
  );
}
