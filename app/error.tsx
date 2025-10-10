'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Oops!
          </h1>
          <h2 className="text-xl text-gray-600 dark:text-gray-400">
            Something went wrong
          </h2>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-900 dark:text-red-300 font-mono break-words">
            {error.message || 'An unexpected error occurred'}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={reset}
            className="w-full"
          >
            Try Again
          </Button>

          <Button
            onClick={() => window.location.href = '/'}
            variant="secondary"
            className="w-full"
          >
            Go to Homepage
          </Button>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>If this problem persists:</p>
          <ol className="mt-2 text-left list-decimal list-inside space-y-1">
            <li>Clear your browser cache</li>
            <li>Check your internet connection</li>
            <li>Verify environment variables are set</li>
            <li>Contact support if issue continues</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
