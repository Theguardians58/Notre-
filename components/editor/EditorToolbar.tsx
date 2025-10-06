// Editor toolbar with formatting options
'use client';

import { FC } from 'react';
import { Editor } from '@tiptap/react';
import {
  BoldIcon,
  ItalicIcon,
  CodeBracketIcon,
  ListBulletIcon,
  QueueListIcon,
  LinkIcon,
  PhotoIcon,
  MinusIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface EditorToolbarProps {
  editor: Editor;
  onAIAction?: (action: string, text: string) => void;
}

export const EditorToolbar: FC<EditorToolbarProps> = ({ editor, onAIAction }) => {
  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={clsx(
        'rounded p-1.5 sm:p-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 touch-manipulation',
        {
          'bg-gray-200 dark:bg-gray-700': isActive,
        }
      )}
    >
      {children}
    </button>
  );

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const triggerAI = () => {
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to);

    if (onAIAction && text) {
      onAIAction('improve', text);
    }
  };

  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-2 sm:px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <span className="text-sm font-bold">H1</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <span className="text-sm font-bold">H2</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <span className="text-sm font-bold">H3</span>
        </ToolbarButton>

        <div className="mx-2 h-6 w-px bg-gray-300 dark:bg-gray-600" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <BoldIcon className="h-5 w-5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <ItalicIcon className="h-5 w-5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          title="Code"
        >
          <CodeBracketIcon className="h-5 w-5" />
        </ToolbarButton>

        <div className="mx-2 h-6 w-px bg-gray-300 dark:bg-gray-600" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <ListBulletIcon className="h-5 w-5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <QueueListIcon className="h-5 w-5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive('taskList')}
          title="Task List"
        >
          <input type="checkbox" className="h-4 w-4" readOnly />
        </ToolbarButton>

        <div className="mx-2 h-6 w-px bg-gray-300 dark:bg-gray-600" />

        <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="Add Link">
          <LinkIcon className="h-5 w-5" />
        </ToolbarButton>

        <ToolbarButton onClick={addImage} title="Add Image">
          <PhotoIcon className="h-5 w-5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <MinusIcon className="h-5 w-5" />
        </ToolbarButton>

        <div className="mx-2 h-6 w-px bg-gray-300 dark:bg-gray-600" />

        {onAIAction && (
          <ToolbarButton onClick={triggerAI} title="AI Assist">
            <SparklesIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </ToolbarButton>
        )}
      </div>
    </div>
  );
};
