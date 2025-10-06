// Encryption settings page
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import { SearchModal } from '@/components/layout/SearchModal';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { EncryptionSetup } from '@/components/encryption/EncryptionSetup';
import { EncryptionStatus } from '@/components/encryption/EncryptionStatus';
import BiometricSetup from '@/components/encryption/BiometricSetup';
import { useNotes } from '@/hooks/useNotes';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useEncryptionStore } from '@/lib/store/useEncryptionStore';
import { signOut } from '@/lib/firebase/auth';
import { encryptExistingNotes } from '@/lib/firebase/encryption-notes';
import { 
  ArrowLeftIcon, 
  ShieldCheckIcon,
  LockClosedIcon,
  KeyIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function EncryptionSettingsPage() {
  const notes = useNotes();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { encryptionKey, isUnlocked, lock } = useEncryptionStore();
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [migrating, setMigrating] = useState(false);
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

  const handleLockEncryption = () => {
    lock();
    toast.success('Encryption locked');
  };

  const handleMigrateNotes = async () => {
    if (!user || !encryptionKey) return;

    if (!confirm('This will encrypt all your existing notes. Continue?')) {
      return;
    }

    setMigrating(true);
    try {
      await encryptExistingNotes(user.id, encryptionKey);
      toast.success('All notes encrypted successfully');
    } catch (error) {
      toast.error('Failed to encrypt notes');
    } finally {
      setMigrating(false);
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
                onClick={() => router.push('/settings')}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Encryption Settings
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <EncryptionStatus />
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
          <div className="flex-1 overflow-y-auto bg-gray-50 p-8 dark:bg-gray-900">
            <div className="mx-auto max-w-2xl space-y-6">
              {/* Encryption Status Card */}
              <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                <div className="flex items-start gap-4">
                  <ShieldCheckIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      End-to-End Encryption
                    </h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      {user?.encryption?.enabled
                        ? 'Your notes are protected with end-to-end encryption'
                        : 'Protect your notes with end-to-end encryption'}
                    </p>
                    <div className="mt-4">
                      <EncryptionStatus />
                    </div>
                  </div>
                </div>
              </div>

              {/* Enable/Disable Encryption */}
              {!user?.encryption?.enabled ? (
                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Enable Encryption
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Once enabled, all your notes will be encrypted on your device before being
                    synced. Only you will be able to decrypt and read them.
                  </p>
                  <Button onClick={() => setSetupModalOpen(true)}>
                    <ShieldCheckIcon className="mr-2 h-5 w-5" />
                    Enable End-to-End Encryption
                  </Button>
                </div>
              ) : (
                <>
                  {/* Biometric Unlock */}
                  <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                      Biometric Unlock
                    </h3>
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                      Use fingerprint or face recognition to unlock your encrypted notes quickly and securely.
                    </p>
                    <BiometricSetup />
                  </div>

                  {/* Encryption Actions */}
                  <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                      Encryption Actions
                    </h3>
                    <div className="space-y-3">
                      {isUnlocked && (
                        <div>
                          <Button onClick={handleLockEncryption} variant="secondary" className="w-full">
                            <LockClosedIcon className="mr-2 h-5 w-5" />
                            Lock Encryption
                          </Button>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Lock encryption to protect your notes. You'll need to unlock again to
                            view or edit them.
                          </p>
                        </div>
                      )}

                      {isUnlocked && (
                        <div>
                          <Button
                            onClick={handleMigrateNotes}
                            variant="secondary"
                            className="w-full"
                            disabled={migrating}
                          >
                            <KeyIcon className="mr-2 h-5 w-5" />
                            {migrating ? 'Encrypting...' : 'Encrypt All Existing Notes'}
                          </Button>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            If you have notes created before enabling encryption, use this to
                            encrypt them.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Security Information */}
                  <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
                    <h4 className="mb-3 font-semibold text-blue-900 dark:text-blue-100">
                      How Your Data is Protected
                    </h4>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                      <li className="flex items-start gap-2">
                        <span>🔐</span>
                        <span>AES-256-GCM encryption (military-grade)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>🔑</span>
                        <span>Keys derived from your password using PBKDF2 (100,000 iterations)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>💾</span>
                        <span>Keys never leave your device or sent to servers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>🚫</span>
                        <span>Zero-knowledge: We cannot read your encrypted notes</span>
                      </li>
                    </ul>
                  </div>

                  {/* Warning */}
                  <div className="rounded-lg bg-red-50 p-6 dark:bg-red-900/20">
                    <h4 className="mb-2 font-semibold text-red-900 dark:text-red-100">
                      ⚠️ Important Security Notice
                    </h4>
                    <p className="text-sm text-red-800 dark:text-red-200">
                      If you forget your encryption password and lose your recovery key, your
                      notes cannot be recovered. We cannot reset your encryption password or
                      access your notes.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <SearchModal />
        <EncryptionSetup
          isOpen={setupModalOpen}
          onComplete={() => setSetupModalOpen(false)}
        />
      </div>
    </AuthGuard>
  );
}
