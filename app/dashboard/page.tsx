// Dashboard page
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { SearchModal } from '@/components/layout/SearchModal';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useNotes } from '@/hooks/useNotes';
import { useTheme } from '@/hooks/useTheme';
import { signOut } from '@/lib/firebase/auth';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const notes = useNotes();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  useTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
      logout();
      router.push('/auth/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <AuthGuard>
      <div className="flex h-screen">
        <Sidebar notes={notes} />

        <div className="flex flex-1 flex-col">
          {/* Mobile Header */}
          <MobileHeader 
            title="Dashboard" 
            notes={notes}
            onAction={handleSignOut}
            actionLabel="Logout"
          />

          {/* Desktop Top bar */}
          <div className="hidden lg:flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h2>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {user?.displayName || user?.email}
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Logout
              </Button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-1 items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
            <div className="text-center">
              <h1 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Welcome to CogniNote
              </h1>
              <p className="mb-8 text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4">
                Select a note from the sidebar or create a new one to get started
              </p>
              <div className="flex justify-center gap-4">
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    {notes.length}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Notes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SearchModal />
      </div>
    </AuthGuard>
  );
}
