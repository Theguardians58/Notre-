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
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    });
  }, [error]);

  const isFirebaseError = error.message.includes('Firebase') || error.message.includes('auth/');
  const isConfigError = error.message.includes('environment') || error.message.includes('configuration');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {isFirebaseError ? '🔥' : '⚠️'} Configuration Error
          </h1>
          <h2 className="text-xl text-gray-600 dark:text-gray-400">
            {isFirebaseError 
              ? 'Firebase configuration issue detected' 
              : 'Something went wrong'}
          </h2>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-sm font-semibold text-red-900 dark:text-red-300 mb-2">
            Error Message:
          </p>
          <p className="text-sm text-red-900 dark:text-red-300 font-mono break-words">
            {error.message || 'An unexpected error occurred'}
          </p>
        </div>

        {(isFirebaseError || isConfigError) && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-3">
              💡 How to Fix:
            </p>
            <ol className="text-sm space-y-2 text-blue-900 dark:text-blue-300 list-decimal list-inside">
              <li>Check the debug page: <a href="/debug" className="underline font-semibold">/debug</a></li>
              <li>Add missing Firebase environment variables to Netlify</li>
              <li>Enable Firebase services (Authentication, Firestore, Storage)</li>
              <li>Redeploy the site</li>
            </ol>
            <div className="mt-4 space-y-2">
              <a
                href="/debug"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mr-2"
              >
                Open Debug Page
              </a>
              <a
                href="https://github.com/Theguardians58/Notre-/blob/main/FIX_FIREBASE_API_KEY_ERROR.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Read Fix Guide
              </a>
            </div>
          </div>
        )}

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

        <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
          <p className="mb-2">Need more help?</p>
          <div className="space-x-3">
            <a href="/debug" className="text-blue-600 dark:text-blue-400 hover:underline">
              Debug Page
            </a>
            <span>•</span>
            <a
              href="https://github.com/Theguardians58/Notre-"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
