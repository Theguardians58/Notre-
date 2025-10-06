// Mermaid diagram viewer and editor
'use client';

import { FC, useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Button } from '@/components/ui/Button';

interface MermaidViewerProps {
  code: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
}

export const MermaidViewer: FC<MermaidViewerProps> = ({
  code: initialCode,
  onChange,
  readOnly = false,
}) => {
  const [code, setCode] = useState(initialCode || defaultMermaidCode);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(!readOnly);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'system-ui',
    });
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || !code) return;

      try {
        setError(null);
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, code);
        containerRef.current.innerHTML = svg;
      } catch (err: any) {
        setError(err.message || 'Failed to render diagram');
        containerRef.current.innerHTML = '';
      }
    };

    renderDiagram();
  }, [code]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onChange?.(newCode);
  };

  return (
    <div className="flex h-full flex-col">
      {!readOnly && (
        <div className="border-b border-gray-200 p-2 dark:border-gray-700">
          <Button
            onClick={() => setIsEditing(!isEditing)}
            size="sm"
            variant="ghost"
          >
            {isEditing ? 'Preview' : 'Edit Code'}
          </Button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {isEditing && !readOnly && (
          <div className="w-1/2 border-r border-gray-200 dark:border-gray-700">
            <textarea
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="h-full w-full resize-none bg-gray-50 p-4 font-mono text-sm text-gray-900 dark:bg-gray-900 dark:text-gray-100"
              placeholder="Enter Mermaid diagram code..."
              spellCheck={false}
            />
          </div>
        )}

        <div className={`flex-1 overflow-auto p-8 ${isEditing ? 'w-1/2' : 'w-full'}`}>
          {error ? (
            <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-200">
              <h3 className="font-semibold">Syntax Error</h3>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          ) : (
            <div
              ref={containerRef}
              className="flex items-center justify-center"
            />
          )}
        </div>
      </div>

      {isEditing && !readOnly && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <strong>Mermaid Syntax Examples:</strong>
            <ul className="ml-4 mt-2 list-disc space-y-1">
              <li>Flowchart: <code>graph TD; A--&gt;B;</code></li>
              <li>Sequence: <code>sequenceDiagram; Alice-&gt;&gt;Bob: Hello</code></li>
              <li>Class: <code>classDiagram; Class01 &lt;|-- AveryLongClass</code></li>
              <li>State: <code>stateDiagram-v2; [*] --&gt; State1</code></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const defaultMermaidCode = `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E`;
