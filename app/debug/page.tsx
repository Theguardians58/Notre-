'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [config, setConfig] = useState<any>({});
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const envVars = {
      backend: process.env.NEXT_PUBLIC_BACKEND,
      firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    setConfig(envVars);

    // Check for missing or invalid config
    const errorList: string[] = [];
    
    if (!envVars.backend) {
      errorList.push('NEXT_PUBLIC_BACKEND is not set');
    }

    if (envVars.backend === 'firebase') {
      if (!envVars.firebaseApiKey) {
        errorList.push('NEXT_PUBLIC_FIREBASE_API_KEY is missing');
      } else if (!envVars.firebaseApiKey.startsWith('AIza')) {
        errorList.push('NEXT_PUBLIC_FIREBASE_API_KEY has invalid format (should start with "AIza")');
      }

      if (!envVars.firebaseAuthDomain) {
        errorList.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is missing');
      }

      if (!envVars.firebaseProjectId) {
        errorList.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing');
      }

      if (!envVars.firebaseStorageBucket) {
        errorList.push('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is missing');
      }

      if (!envVars.firebaseMessagingSenderId) {
        errorList.push('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID is missing');
      }

      if (!envVars.firebaseAppId) {
        errorList.push('NEXT_PUBLIC_FIREBASE_APP_ID is missing');
      }
    }

    setErrors(errorList);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          🔍 CogniNote Configuration Debug
        </h1>

        {/* Status Summary */}
        <div className={`p-6 rounded-lg mb-6 ${errors.length === 0 ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
          <h2 className="text-xl font-semibold mb-2">
            {errors.length === 0 ? '✅ Configuration OK' : '❌ Configuration Errors'}
          </h2>
          <p className={errors.length === 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
            {errors.length === 0 
              ? 'All environment variables are properly configured!' 
              : `Found ${errors.length} configuration issue(s)`}
          </p>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-red-900 dark:text-red-300">
              🚨 Issues Found
            </h2>
            <ul className="space-y-2">
              {errors.map((error, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span className="text-red-900 dark:text-red-300">{error}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded">
              <p className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                How to Fix:
              </p>
              <ol className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                <li>1. Go to Netlify: Site settings → Environment variables</li>
                <li>2. Add the missing variables from Firebase Console</li>
                <li>3. Trigger a new deploy</li>
                <li>4. Check this page again</li>
              </ol>
              <a
                href="https://github.com/Theguardians58/Notre-/blob/main/FIX_FIREBASE_API_KEY_ERROR.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
              >
                📚 Read Complete Fix Guide →
              </a>
            </div>
          </div>
        )}

        {/* Configuration Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            📋 Environment Variables
          </h2>
          <div className="space-y-3">
            {Object.entries(config).map(([key, value]) => {
              const isSet = value !== undefined && value !== '';
              const isSensitive = key.toLowerCase().includes('key') || key.toLowerCase().includes('id');
              
              return (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="flex-1">
                    <div className="font-mono text-sm text-gray-600 dark:text-gray-400">
                      NEXT_PUBLIC_{key.replace(/([A-Z])/g, '_$1').toUpperCase().replace('__', '_')}
                    </div>
                    <div className="text-xs mt-1">
                      {isSet ? (
                        <span className="text-green-600 dark:text-green-400">
                          {isSensitive 
                            ? `Set (${String(value).substring(0, 10)}...)`
                            : `Set (${value})`}
                        </span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400">Not set</span>
                      )}
                    </div>
                  </div>
                  <div>
                    {isSet ? (
                      <span className="text-green-500 text-xl">✓</span>
                    ) : (
                      <span className="text-red-500 text-xl">✗</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Browser Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            🌐 Browser Information
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">User Agent:</span>
              <span className="text-gray-900 dark:text-white font-mono text-xs">
                {typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 50) + '...' : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">URL:</span>
              <span className="text-gray-900 dark:text-white font-mono text-xs">
                {typeof window !== 'undefined' ? window.location.href : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex gap-4">
          <a
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </a>
          <a
            href="https://app.netlify.com/sites/fancy-pothos-3c2eb5/settings/env"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Open Netlify Settings
          </a>
        </div>
      </div>
    </div>
  );
}
