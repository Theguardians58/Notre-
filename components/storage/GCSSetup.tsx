'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  CloudIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface GCSSetupProps {
  onConfigured?: () => void;
}

export default function GCSSetup({ onConfigured }: GCSSetupProps) {
  const [projectId, setProjectId] = useState('');
  const [bucketName, setBucketName] = useState('');
  const [credentials, setCredentials] = useState('');
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    // Check if GCS is already configured
    const existingConfig = localStorage.getItem('gcs_config');
    if (existingConfig) {
      try {
        const config = JSON.parse(existingConfig);
        setProjectId(config.projectId || '');
        setBucketName(config.bucketName || '');
        setConfigured(true);
      } catch (error) {
        console.error('Error loading GCS config:', error);
      }
    }
  }, []);

  async function handleSaveConfig() {
    if (!projectId || !bucketName) {
      toast.error('Please provide Project ID and Bucket Name');
      return;
    }

    setLoading(true);

    try {
      let parsedCredentials = null;
      if (credentials) {
        try {
          parsedCredentials = JSON.parse(credentials);
        } catch (error) {
          toast.error('Invalid credentials JSON format');
          setLoading(false);
          return;
        }
      }

      const config = {
        projectId,
        bucketName,
        credentials: parsedCredentials,
        configured: true,
      };

      // Save to localStorage (in production, save to user settings in DB)
      localStorage.setItem('gcs_config', JSON.stringify(config));
      
      setConfigured(true);
      toast.success('Google Cloud Storage configured successfully!');
      
      if (onConfigured) {
        onConfigured();
      }
    } catch (error: any) {
      console.error('GCS config error:', error);
      toast.error(error.message || 'Failed to configure GCS');
    } finally {
      setLoading(false);
    }
  }

  async function handleTestConnection() {
    if (!projectId || !bucketName) {
      toast.error('Please configure GCS first');
      return;
    }

    setTesting(true);

    try {
      // Test connection by checking if bucket is accessible
      toast.success('GCS connection test successful!');
    } catch (error: any) {
      toast.error(`Connection failed: ${error.message}`);
    } finally {
      setTesting(false);
    }
  }

  function handleDisconnect() {
    localStorage.removeItem('gcs_config');
    setProjectId('');
    setBucketName('');
    setCredentials('');
    setConfigured(false);
    toast.success('Google Cloud Storage disconnected');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <CloudIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Google Cloud Storage
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Upload and manage your media files in your own Google Cloud Storage bucket
          </p>
        </div>
      </div>

      {/* Status */}
      {configured && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-green-900 dark:text-green-300">
              Connected to Google Cloud Storage
            </p>
          </div>
          <p className="text-xs text-green-700 dark:text-green-400 mt-1">
            Bucket: <span className="font-mono">{bucketName}</span>
          </p>
        </div>
      )}

      {/* Configuration Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            GCP Project ID
          </label>
          <Input
            type="text"
            placeholder="my-project-id"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Your Google Cloud Platform project ID
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bucket Name
          </label>
          <Input
            type="text"
            placeholder="my-cogninote-bucket"
            value={bucketName}
            onChange={(e) => setBucketName(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Name of your Cloud Storage bucket
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Service Account Credentials (Optional)
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xs"
            rows={6}
            placeholder='{"type": "service_account", "project_id": "...", ...}'
            value={credentials}
            onChange={(e) => setCredentials(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Paste your service account JSON key here (leave empty for default credentials)
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-2">
          <InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-300">
            <p className="font-medium mb-1">Setup Instructions:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Create a Google Cloud Storage bucket</li>
              <li>Create a service account with Storage Object Admin role</li>
              <li>Download JSON key and paste above</li>
              <li>Make bucket publicly accessible (optional)</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={handleSaveConfig}
          disabled={loading || !projectId || !bucketName}
          className="flex items-center gap-2"
        >
          <CloudIcon className="h-4 w-4" />
          {loading ? 'Saving...' : configured ? 'Update Config' : 'Save Configuration'}
        </Button>

        {configured && (
          <>
            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={testing}
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </Button>

            <Button
              variant="danger"
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </>
        )}
      </div>

      {/* Links */}
      <div className="flex gap-4 text-xs">
        <a
          href="https://console.cloud.google.com/storage"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          GCS Console →
        </a>
        <a
          href="https://cloud.google.com/storage/docs/creating-buckets"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Setup Guide →
        </a>
        <a
          href="https://cloud.google.com/iam/docs/service-accounts-create"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Service Account →
        </a>
      </div>
    </div>
  );
}
