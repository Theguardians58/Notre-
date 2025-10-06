// Settings page
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import { SearchModal } from '@/components/layout/SearchModal';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useNotes } from '@/hooks/useNotes';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { updateAPIKey, setDefaultAIProvider } from '@/lib/firebase/settings';
import { getUserData, signOut } from '@/lib/firebase/auth';
import { AIProvider } from '@/lib/types';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const notes = useNotes();
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  const [geminiKey, setGeminiKey] = useState(user?.settings.apiKeys.gemini || '');
  const [openaiKey, setOpenaiKey] = useState(user?.settings.apiKeys.openai || '');
  const [anthropicKey, setAnthropicKey] = useState(user?.settings.apiKeys.anthropic || '');
  const [defaultProvider, setDefaultProvider] = useState<AIProvider>(
    user?.settings.defaultAIProvider || 'gemini'
  );
  const [saving, setSaving] = useState(false);
  useTheme();

  const handleSaveSettings = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Update API keys
      if (geminiKey !== user.settings.apiKeys.gemini) {
        await updateAPIKey(user.id, 'gemini', geminiKey);
      }
      if (openaiKey !== user.settings.apiKeys.openai) {
        await updateAPIKey(user.id, 'openai', openaiKey);
      }
      if (anthropicKey !== user.settings.apiKeys.anthropic) {
        await updateAPIKey(user.id, 'anthropic', anthropicKey);
      }

      // Update default provider
      if (defaultProvider !== user.settings.defaultAIProvider) {
        await setDefaultAIProvider(user.id, defaultProvider);
      }

      // Reload user data
      const updatedUser = await getUserData(user.id);
      setUser(updatedUser);

      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

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
                onClick={() => router.back()}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
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

          {/* Main content */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-900">
            <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
              {/* Encryption Settings Link */}
              <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      🔐 End-to-End Encryption
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Protect your notes with military-grade encryption
                    </p>
                  </div>
                  <Button onClick={() => router.push('/settings/encryption')}>
                    Configure
                  </Button>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                  AI Provider Settings
                </h3>

                <div className="space-y-6">
                  {/* Default Provider */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Default AI Provider
                    </label>
                    <select
                      value={defaultProvider}
                      onChange={(e) => setDefaultProvider(e.target.value as AIProvider)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    >
                      <option value="gemini">Google Gemini</option>
                      <option value="openai">OpenAI (GPT-4)</option>
                      <option value="anthropic">Anthropic (Claude)</option>
                    </select>
                  </div>

                  {/* Gemini API Key */}
                  <div>
                    <Input
                      type="password"
                      label="Google Gemini API Key"
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      placeholder="Enter your Gemini API key"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Get your API key from{' '}
                      <a
                        href="https://makersuite.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Google AI Studio
                      </a>
                    </p>
                  </div>

                  {/* OpenAI API Key */}
                  <div>
                    <Input
                      type="password"
                      label="OpenAI API Key"
                      value={openaiKey}
                      onChange={(e) => setOpenaiKey(e.target.value)}
                      placeholder="Enter your OpenAI API key"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Get your API key from{' '}
                      <a
                        href="https://platform.openai.com/api-keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        OpenAI Platform
                      </a>
                    </p>
                  </div>

                  {/* Anthropic API Key */}
                  <div>
                    <Input
                      type="password"
                      label="Anthropic API Key"
                      value={anthropicKey}
                      onChange={(e) => setAnthropicKey(e.target.value)}
                      placeholder="Enter your Anthropic API key"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Get your API key from{' '}
                      <a
                        href="https://console.anthropic.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Anthropic Console
                      </a>
                    </p>
                  </div>

                  {/* Security Notice */}
                  <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      🔒 Your API keys are encrypted and stored securely in your private Firestore
                      database. They are never shared or exposed publicly.
                    </p>
                  </div>

                  {/* Save Button */}
                  <Button onClick={handleSaveSettings} disabled={saving} className="w-full">
                    {saving ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </div>

              {/* Account Information */}
              <div className="mt-6 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Account Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Name: </span>
                    <span className="text-gray-900 dark:text-gray-100">{user?.displayName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Email: </span>
                    <span className="text-gray-900 dark:text-gray-100">{user?.email}</span>
                  </div>
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
