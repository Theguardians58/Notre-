// Slash commands dropdown list
'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  ForwardRefRenderFunction,
} from 'react';

interface SlashCommandsListProps {
  items: any[];
  command: (item: any) => void;
}

const SlashCommandsListComponent: ForwardRefRenderFunction<any, SlashCommandsListProps> = (
  { items, command },
  ref
) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = items[index];
    if (item) {
      command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + items.length - 1) % items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="z-50 max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      {items.length ? (
        items.map((item, index) => (
          <button
            key={index}
            className={`w-full rounded px-3 py-2 text-left transition-colors ${
              index === selectedIndex
                ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                : 'text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => selectItem(index)}
          >
            {item.title}
          </button>
        ))
      ) : (
        <div className="px-3 py-2 text-gray-500 dark:text-gray-400">No results</div>
      )}
    </div>
  );
};

export const SlashCommandsList = forwardRef(SlashCommandsListComponent);
SlashCommandsList.displayName = 'SlashCommandsList';
