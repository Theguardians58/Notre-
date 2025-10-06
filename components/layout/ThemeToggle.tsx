// Theme toggle component
'use client';

import { FC } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useUIStore } from '@/lib/store/useUIStore';

export const ThemeToggle: FC = () => {
  const { theme, setTheme } = useUIStore();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );
};
