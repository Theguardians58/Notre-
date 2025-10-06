// Diagram type selector modal
'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { DocumentType } from '@/lib/types';
import { createNote } from '@/lib/firebase/notes';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useNotesStore } from '@/lib/store/useNotesStore';
import toast from 'react-hot-toast';

interface DiagramSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const diagramTypes = [
  {
    type: 'flowchart' as DocumentType,
    title: 'Flowchart',
    description: 'Create process flows and workflows',
    icon: '📊',
    color: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    type: 'mindmap' as DocumentType,
    title: 'Mindmap',
    description: 'Organize ideas and brainstorm',
    icon: '🧠',
    color: 'bg-purple-100 dark:bg-purple-900/30',
  },
  {
    type: 'whiteboard' as DocumentType,
    title: 'Whiteboard',
    description: 'Freeform drawing and sketching',
    icon: '🎨',
    color: 'bg-green-100 dark:bg-green-900/30',
  },
  {
    type: 'mermaid_diagram' as DocumentType,
    title: 'Mermaid Diagram',
    description: 'Text-based diagrams (flowcharts, sequences, etc.)',
    icon: '🐠',
    color: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
];

export const DiagramSelector: FC<DiagramSelectorProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const { addNote } = useNotesStore();
  const router = useRouter();

  const handleSelectDiagram = async (type: DocumentType) => {
    if (!user) return;

    try {
      const note = await createNote(user.id, `New ${type}`, type);
      addNote(note);
      router.push(`/note/${note.id}`);
      toast.success(`${type} created`);
      onClose();
    } catch (error) {
      toast.error('Failed to create diagram');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Diagram">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {diagramTypes.map((diagram) => (
          <button
            key={diagram.type}
            onClick={() => handleSelectDiagram(diagram.type)}
            className={`rounded-lg p-4 sm:p-6 text-left transition-all hover:scale-105 active:scale-95 touch-manipulation ${diagram.color}`}
          >
            <div className="mb-2 text-3xl sm:text-4xl">{diagram.icon}</div>
            <h3 className="mb-1 text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
              {diagram.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{diagram.description}</p>
          </button>
        ))}
      </div>
    </Modal>
  );
};
