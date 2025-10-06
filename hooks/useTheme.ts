// Theme hook with system preference detection
'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/lib/store/useUIStore';
import { useAuthStore } from '@/lib/store/useAuthStore';

export const useTheme = () => {
  const { theme, setTheme } = useUIStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // Load theme from user settings
    if (user?.settings.theme) {
      setTheme(user.settings.theme);
    }
  }, [user, setTheme]);

  useEffect(() => {
    const root = document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

    const activeTheme = theme === 'system' ? systemTheme : theme;

    if (activeTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return { theme, setTheme };
};
