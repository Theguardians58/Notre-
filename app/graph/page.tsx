'use client';

import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import { SearchModal } from '@/components/layout/SearchModal';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/Button';
import dynamic from 'next/dynamic';

const GraphView = dynamic(() => import('@/components/graph/GraphView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading graph...</p>
      </div>
    </div>
  ),
});
import { useNotes } from '@/hooks/useNotes';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { signOut } from '@/lib/firebase/auth';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function GraphPage() {
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
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Graph View
              </h2>
            </div>
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

          {/* Graph View */}
          <div className="flex-1">
            <GraphView notes={notes} />
          </div>
        </div>

        <SearchModal />
      </div>
    </AuthGuard>
  );
}
