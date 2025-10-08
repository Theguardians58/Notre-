'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { Button } from '@/components/ui/Button';
import GCSSetup from '@/components/storage/GCSSetup';
import GCSUpload from '@/components/storage/GCSUpload';
import { 
  CloudIcon,
  ServerIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function StorageSettingsPage() {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <MobileHeader />

          {/* Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Header */}
              <div className="mb-8">
                <Link
                  href="/settings"
                  className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Back to Settings
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Storage Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Manage your media file storage preferences
                </p>
              </div>

              {/* Storage Options */}
              <div className="space-y-6">
                {/* Default Storage */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <ServerIcon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Default Storage
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Files are stored in Firebase Storage or Appwrite Storage (based on your backend)
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-900 dark:text-blue-300">
                      ✓ Currently using default storage
                    </p>
                  </div>
                </div>

                {/* Google Cloud Storage */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <GCSSetup />
                </div>

                {/* Test Upload */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Test Upload
                  </h3>
                  <GCSUpload
                    onUploadComplete={(url, filename) => {
                      console.log('Uploaded:', url, filename);
                    }}
                    acceptedTypes="image/*,video/*"
                    maxSizeMB={50}
                  />
                </div>

                {/* Benefits */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Why use Google Cloud Storage?
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">✓</span>
                      <span>Full control over your media files</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">✓</span>
                      <span>Lower costs for large files</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">✓</span>
                      <span>Faster global delivery with CDN</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">✓</span>
                      <span>Use existing GCP infrastructure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">✓</span>
                      <span>Advanced access controls and versioning</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
