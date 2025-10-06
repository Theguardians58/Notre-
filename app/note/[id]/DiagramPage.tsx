// Diagram-specific note page component
'use client';

import { FC, useState } from 'react';
import { Note } from '@/lib/types';
import { FlowchartEditor } from '@/components/diagrams/FlowchartEditor';
import { MindmapEditor } from '@/components/diagrams/MindmapEditor';
import { WhiteboardEditor } from '@/components/diagrams/WhiteboardEditor';
import { MermaidViewer } from '@/components/diagrams/MermaidViewer';

interface DiagramPageProps {
  note: Note;
  onContentChange: (content: any) => void;
}

export const DiagramPage: FC<DiagramPageProps> = ({ note, onContentChange }) => {
  const [saving, setSaving] = useState(false);

  const handleChange = async (content: any) => {
    setSaving(true);
    await onContentChange(content);
    setSaving(false);
  };

  return (
    <div className="flex h-full flex-col">
      {saving && (
        <div className="border-b border-gray-200 bg-yellow-50 px-4 py-2 text-sm text-yellow-800 dark:border-gray-700 dark:bg-yellow-900/20 dark:text-yellow-200">
          Saving...
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {note.type === 'flowchart' && (
          <FlowchartEditor
            initialNodes={note.content?.nodes || []}
            initialEdges={note.content?.edges || []}
            onChange={(nodes, edges) => handleChange({ nodes, edges })}
          />
        )}

        {note.type === 'mindmap' && (
          <MindmapEditor
            initialNodes={note.content?.nodes || []}
            initialEdges={note.content?.edges || []}
            onChange={(nodes, edges) => handleChange({ nodes, edges })}
          />
        )}

        {note.type === 'whiteboard' && (
          <WhiteboardEditor
            initialData={note.content}
            onChange={handleChange}
          />
        )}

        {note.type === 'mermaid_diagram' && (
          <MermaidViewer
            code={note.content?.code || ''}
            onChange={(code) => handleChange({ code })}
          />
        )}
      </div>
    </div>
  );
};
