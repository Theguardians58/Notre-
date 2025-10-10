'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileHeader } from '@/components/layout/MobileHeader';
import GCSSetup from '@/components/storage/GCSSetup';
import GCSUpload from '@/components/storage/GCSUpload';
import GoogleDriveSetup from '@/components/storage/GoogleDriveSetup';
import GoogleDriveUpload from '@/components/storage/GoogleDriveUpload';
import GoogleDriveFilePicker from '@/components/storage/GoogleDriveFilePicker';
import GoogleDrivePlayer from '@/components/media/GoogleDrivePlayer';
import { useNotes } from '@/hooks/useNotes';
import { 
  ServerIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function StorageSettingsPage() {
  const notes = useNotes();
  const [selectedDriveFile, setSelectedDriveFile] = useState<any>(null);
  
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar notes={notes} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <MobileHeader notes={notes} />

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
                  Choose where to store your media files
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
                        Default Backend Storage
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Files stored in your selected backend (Firebase/Appwrite/Supabase)
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-900 dark:text-blue-300">
                      ✓ Currently active - No setup required
                    </p>
                  </div>
                </div>

                {/* Google Drive Integration */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <GoogleDriveSetup />
                </div>

                {/* Google Drive Upload */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Upload to Google Drive
                  </h3>
                  <GoogleDriveUpload
                    onUploadComplete={(file) => {
                      console.log('Uploaded to Google Drive:', file);
                      toast.success(`${file.name} uploaded successfully!`);
                    }}
                  />
                </div>

                {/* Google Drive File Browser */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <GoogleDriveFilePicker
                    onFileSelect={(file) => {
                      setSelectedDriveFile(file);
                      toast.success(`Selected: ${file.name}`);
                    }}
                  />
                </div>

                {/* Selected File Player */}
                {selectedDriveFile && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Playing from Google Drive
                    </h3>
                    <GoogleDrivePlayer fileId={selectedDriveFile.id} />
                  </div>
                )}

                {/* Google Cloud Storage */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <GCSSetup />
                </div>

                {/* GCS Test Upload */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Test GCS Upload
                  </h3>
                  <GCSUpload
                    onUploadComplete={(url, filename) => {
                      console.log('Uploaded to GCS:', url, filename);
                      toast.success(`${filename} uploaded to GCS!`);
                    }}
                    acceptedTypes="image/*,video/*"
                    maxSizeMB={50}
                  />
                </div>

                {/* Storage Comparison */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Storage Options Comparison
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {/* Google Drive */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-blue-500">
                      <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                        Google Drive ⭐
                      </h4>
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                        <li>✓ 15 GB free</li>
                        <li>✓ Direct streaming</li>
                        <li>✓ Access anywhere</li>
                        <li>✓ Auto backup</li>
                      </ul>
                    </div>

                    {/* Google Cloud Storage */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Google Cloud Storage
                      </h4>
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                        <li>✓ Full control</li>
                        <li>✓ Low cost ($0.026/GB)</li>
                        <li>✓ Global CDN</li>
                        <li>✓ Advanced features</li>
                      </ul>
                    </div>

                    {/* Backend Storage */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Backend Storage
                      </h4>
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                        <li>✓ Auto-managed</li>
                        <li>✓ No setup needed</li>
                        <li>✓ Built-in CDN</li>
                        <li>✓ Simple API</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
