'use client';

import { useEffect, useState } from 'react';
import { UserPresence } from '@/lib/collaboration/presence';

interface CollaborativeCursorsProps {
  users: UserPresence[];
  editorElement: HTMLElement | null;
}

export default function CollaborativeCursors({ users, editorElement }: CollaborativeCursorsProps) {
  const [cursors, setCursors] = useState<Map<string, { x: number; y: number }>>(new Map());

  useEffect(() => {
    if (!editorElement) return;

    // Calculate cursor positions based on editor content
    const updateCursorPositions = () => {
      const newCursors = new Map();

      users.forEach(user => {
        if (user.cursorPosition) {
          try {
            // Find the DOM node at the cursor position
            const editorView = editorElement.querySelector('.ProseMirror');
            if (!editorView) return;

            // This is a simplified version - in production, you'd need
            // to properly map Tiptap positions to DOM coordinates
            const rect = editorElement.getBoundingClientRect();
            newCursors.set(user.userId, {
              x: rect.left + Math.random() * rect.width, // Placeholder
              y: rect.top + Math.random() * rect.height, // Placeholder
            });
          } catch (error) {
            console.error('Error calculating cursor position:', error);
          }
        }
      });

      setCursors(newCursors);
    };

    updateCursorPositions();
    
    // Update on scroll/resize
    const handleUpdate = () => updateCursorPositions();
    window.addEventListener('scroll', handleUpdate);
    window.addEventListener('resize', handleUpdate);

    return () => {
      window.removeEventListener('scroll', handleUpdate);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [users, editorElement]);

  return (
    <>
      {Array.from(cursors.entries()).map(([userId, position]) => {
        const user = users.find(u => u.userId === userId);
        if (!user) return null;

        return (
          <div
            key={userId}
            className="fixed pointer-events-none z-50 transition-all duration-100"
            style={{
              left: position.x,
              top: position.y,
            }}
          >
            {/* Cursor */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
            >
              <path
                d="M2 2L8 18L10 11L17 9L2 2Z"
                fill={user.color}
              />
            </svg>

            {/* Label */}
            <div
              className="absolute top-4 left-4 px-2 py-1 rounded text-white text-xs font-medium whitespace-nowrap"
              style={{ backgroundColor: user.color }}
            >
              {user.userName}
            </div>
          </div>
        );
      })}
    </>
  );
}
