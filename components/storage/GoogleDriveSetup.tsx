'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  initializeGoogleDrive,
  signInToGoogleDrive,
  signOutFromGoogleDrive,
  isSignedInToGoogleDrive,
  saveGoogleDriveConfig,
  loadGoogleDriveConfig,
  clearGoogleDriveConfig,
} from '@/lib/storage/google-drive';
import toast from 'react-hot-toast';
import { CloudIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function GoogleDriveSetup() {
  const [clientId, setClientId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load saved configuration
    const config = loadGoogleDriveConfig();
    if (config) {
      setClientId(config.clientId);
      setApiKey(config.apiKey);
      setIsConfigured(true);
      checkSignInStatus();
    }
  }, []);

  const checkSignInStatus = () => {
    setIsSignedIn(isSignedInToGoogleDrive());
  };

  const handleSaveConfig = async () => {
    if (!clientId || !apiKey) {
      toast.error('Please enter both Client ID and API Key');
      return;
    }

    setIsSaving(true);
    try {
      const config = {
        clientId,
        apiKey,
        scopes: [
          'https://www.googleapis.com/auth/drive.file',
          'https://www.googleapis.com/auth/drive.readonly',
        ],
      };

      // Save configuration
      saveGoogleDriveConfig(config);
      setIsConfigured(true);
      toast.success('Google Drive configuration saved');
    } catch (error) {
      toast.error('Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInitialize = async () => {
    if (!clientId || !apiKey) {
      toast.error('Please configure Google Drive first');
      return;
    }

    setIsInitializing(true);
    try {
      await initializeGoogleDrive(clientId, apiKey);
      toast.success('Google Drive initialized');
      checkSignInStatus();
    } catch (error) {
      toast.error('Failed to initialize Google Drive');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSignIn = async () => {
    try {
      // Initialize first if not already
      if (!(window as any).gapi?.client) {
        await handleInitialize();
      }

      await signInToGoogleDrive();
      setIsSignedIn(true);
      toast.success('Signed in to Google Drive');
    } catch (error) {
      toast.error('Failed to sign in to Google Drive');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutFromGoogleDrive();
      setIsSignedIn(false);
      toast.success('Signed out from Google Drive');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const handleDisconnect = () => {
    clearGoogleDriveConfig();
    setClientId('');
    setApiKey('');
    setIsConfigured(false);
    setIsSignedIn(false);
    toast.success('Google Drive disconnected');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <CloudIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Google Drive Integration
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Upload and access your media files directly from Google Drive
          </p>
        </div>
        {isSignedIn && (
          <CheckCircleIcon className="h-6 w-6 text-green-500" />
        )}
      </div>

      {/* Status */}
      {isConfigured && (
        <div className={`p-4 rounded-lg ${
          isSignedIn 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
        }`}>
          <p className={`text-sm font-medium ${
            isSignedIn 
              ? 'text-green-900 dark:text-green-300'
              : 'text-blue-900 dark:text-blue-300'
          }`}>
            {isSignedIn ? '✓ Connected to Google Drive' : 'ℹ Configured (not signed in)'}
          </p>
        </div>
      )}

      {/* Configuration Form */}
      {!isConfigured ? (
        <div className="space-y-4">
          <div>
            <Input
              label="Google OAuth Client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="123456789-abcdefg.apps.googleusercontent.com"
              type="text"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Get this from{' '}
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Google Cloud Console → APIs & Services → Credentials
              </a>
            </p>
          </div>

          <div>
            <Input
              label="Google API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSyXXXXXXXXXXXXXXXXXXX"
              type="password"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Create an API key in the same Google Cloud Console page
            </p>
          </div>

          <Button
            onClick={handleSaveConfig}
            disabled={isSaving || !clientId || !apiKey}
            className="w-full"
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>

          {/* Setup Instructions */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
              📝 Quick Setup (5 minutes)
            </h4>
            <ol className="text-xs text-yellow-800 dark:text-yellow-200 space-y-1 list-decimal list-inside">
              <li>Go to Google Cloud Console</li>
              <li>Create or select a project</li>
              <li>Enable Google Drive API</li>
              <li>Create OAuth 2.0 Client ID (Web application)</li>
              <li>Add your domain to Authorized JavaScript origins</li>
              <li>Create API Key (restrict to Drive API)</li>
              <li>Copy Client ID and API Key here</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Client ID:
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                {clientId.substring(0, 20)}...
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Status:
              </span>
              <span className={`text-sm font-medium ${
                isSignedIn ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {isSignedIn ? 'Connected' : 'Not signed in'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {!isSignedIn ? (
              <>
                <Button
                  onClick={handleInitialize}
                  disabled={isInitializing}
                  variant="primary"
                  className="flex-1"
                >
                  {isInitializing ? 'Initializing...' : 'Initialize'}
                </Button>
                <Button
                  onClick={handleSignIn}
                  variant="primary"
                  className="flex-1"
                >
                  Sign In to Google Drive
                </Button>
              </>
            ) : (
              <Button
                onClick={handleSignOut}
                variant="secondary"
                className="flex-1"
              >
                Sign Out
              </Button>
            )}
            <Button
              onClick={handleDisconnect}
              variant="danger"
            >
              Disconnect
            </Button>
          </div>

          {/* Info */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
              ℹ️ How it works
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Files are uploaded to your Google Drive</li>
              <li>• They're stored in a "CogniNote" folder</li>
              <li>• You have full control and ownership</li>
              <li>• Access them from any device with Google Drive</li>
              <li>• No storage limits from CogniNote</li>
            </ul>
          </div>
        </div>
      )}

      {/* Benefits */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          ✨ Benefits of Google Drive Storage
        </h4>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">✓</span>
            <span>15 GB free storage (Google account)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">✓</span>
            <span>Access files from any device</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">✓</span>
            <span>Stream videos and audio directly</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">✓</span>
            <span>Automatic backup and versioning</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">✓</span>
            <span>Share files with Google Drive sharing</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
