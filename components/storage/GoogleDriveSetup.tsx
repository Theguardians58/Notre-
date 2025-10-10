/**
 * Google Drive Setup Component
 * Configure Google Drive integration for media storage
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { 
  CloudIcon, 
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';

interface GoogleDriveConfig {
  clientId: string;
  apiKey: string;
  connected: boolean;
}

export default function GoogleDriveSetup() {
  const [config, setConfig] = useState<GoogleDriveConfig>({
    clientId: '',
    apiKey: '',
    connected: false,
  });
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    // Load saved config from localStorage
    const saved = localStorage.getItem('googleDriveConfig');
    if (saved) {
      setConfig(JSON.parse(saved));
    }
  }, []);

  const handleSave = async () => {
    if (!config.clientId || !config.apiKey) {
      toast.error('Please fill in all fields');
      return;
    }

    setSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('googleDriveConfig', JSON.stringify({
        ...config,
        connected: false,
      }));
      
      toast.success('Google Drive configuration saved');
    } catch (error) {
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleConnect = async () => {
    if (!config.clientId || !config.apiKey) {
      toast.error('Please save configuration first');
      return;
    }

    setTesting(true);
    try {
      // Load Google API
      await loadGoogleAPI();
      
      // Initialize client
      await (window as any).gapi.client.init({
        apiKey: config.apiKey,
        clientId: config.clientId,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        scope: 'https://www.googleapis.com/auth/drive.file',
      });

      // Sign in
      const auth = (window as any).gapi.auth2.getAuthInstance();
      if (!auth.isSignedIn.get()) {
        await auth.signIn();
      }

      const updatedConfig = { ...config, connected: true };
      setConfig(updatedConfig);
      localStorage.setItem('googleDriveConfig', JSON.stringify(updatedConfig));
      
      toast.success('Connected to Google Drive!');
    } catch (error: any) {
      console.error('Google Drive connection error:', error);
      toast.error('Failed to connect to Google Drive');
    } finally {
      setTesting(false);
    }
  };

  const handleDisconnect = () => {
    const auth = (window as any).gapi?.auth2?.getAuthInstance();
    if (auth) {
      auth.signOut();
    }

    const updatedConfig = { ...config, connected: false };
    setConfig(updatedConfig);
    localStorage.setItem('googleDriveConfig', JSON.stringify(updatedConfig));
    
    toast.success('Disconnected from Google Drive');
  };

  const loadGoogleAPI = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ((window as any).gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        (window as any).gapi.load('client:auth2', () => resolve());
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <CloudIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Google Drive Storage
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Upload and access your media files directly from Google Drive
          </p>
        </div>
      </div>

      {/* Connection Status */}
      <div className={`p-4 rounded-lg ${
        config.connected 
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
      }`}>
        <div className="flex items-center gap-2">
          {config.connected ? (
            <>
              <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-900 dark:text-green-100">
                Connected to Google Drive
              </span>
            </>
          ) : (
            <>
              <XCircleIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Not connected
              </span>
            </>
          )}
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-100">
            <p className="font-semibold mb-2">Setup Instructions:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
              <li>Create a new project or select existing</li>
              <li>Enable Google Drive API</li>
              <li>Create OAuth 2.0 credentials (Web application)</li>
              <li>Add authorized JavaScript origins: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">http://localhost:3000</code></li>
              <li>Create API key</li>
              <li>Copy Client ID and API Key below</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="space-y-4">
        <Input
          label="Google Client ID"
          type="text"
          value={config.clientId}
          onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
          placeholder="xxxxx.apps.googleusercontent.com"
          disabled={config.connected}
        />

        <Input
          label="Google API Key"
          type="password"
          value={config.apiKey}
          onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
          placeholder="AIza..."
          disabled={config.connected}
        />

        {/* Buttons */}
        <div className="flex gap-3">
          {!config.connected ? (
            <>
              <Button
                onClick={handleSave}
                disabled={saving || !config.clientId || !config.apiKey}
                variant="secondary"
                className="flex-1"
              >
                {saving ? 'Saving...' : 'Save Configuration'}
              </Button>
              <Button
                onClick={handleConnect}
                disabled={testing || !config.clientId || !config.apiKey}
                className="flex-1"
              >
                {testing ? 'Connecting...' : 'Connect to Google Drive'}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleDisconnect}
              variant="danger"
              className="w-full"
            >
              Disconnect Google Drive
            </Button>
          )}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          Why use Google Drive?
        </h4>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">✓</span>
            <span>15 GB free storage (or more with Google One)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">✓</span>
            <span>Access your files from anywhere</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">✓</span>
            <span>Automatic sync with your Google account</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">✓</span>
            <span>Built-in file versioning and recovery</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">✓</span>
            <span>Share files easily with others</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
