// Encryption setup wizard for new users
'use client';

import { FC, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  generateSalt, 
  deriveKey, 
  saltToBase64, 
  hashPassword,
  generateRecoveryKey 
} from '@/lib/crypto/encryption';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useEncryptionStore } from '@/lib/store/useEncryptionStore';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import toast from 'react-hot-toast';
import { ShieldCheckIcon, KeyIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

interface EncryptionSetupProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const EncryptionSetup: FC<EncryptionSetupProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState<'intro' | 'password' | 'recovery'>('intro');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryKey, setRecoveryKey] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuthStore();
  const { setEncryptionKey } = useEncryptionStore();

  const handleEnableEncryption = async () => {
    if (!user) return;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      // Generate salt for key derivation
      const salt = generateSalt();
      const saltBase64 = saltToBase64(salt);

      // Derive encryption key from password
      const encryptionKey = await deriveKey(password, salt);

      // Hash password for verification
      const passwordHashValue = await hashPassword(password, salt);

      // Generate recovery key
      const recovery = generateRecoveryKey();
      setRecoveryKey(recovery);

      // Update user document with encryption info
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        'encryption.enabled': true,
        'encryption.salt': saltBase64,
        'encryption.passwordHash': passwordHashValue,
      });

      // Store key in memory
      setEncryptionKey(encryptionKey);

      // Update local user state
      setUser({
        ...user,
        encryption: {
          enabled: true,
          salt: saltBase64,
          passwordHash: passwordHashValue,
        },
      });

      toast.success('End-to-end encryption enabled!');
      setStep('recovery');
    } catch (error) {
      console.error('Encryption setup error:', error);
      toast.error('Failed to enable encryption');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    toast.info('You can enable encryption later in Settings');
    onComplete();
  };

  const handleComplete = () => {
    setPassword('');
    setConfirmPassword('');
    onComplete();
  };

  const copyRecoveryKey = () => {
    navigator.clipboard.writeText(recoveryKey);
    toast.success('Recovery key copied to clipboard');
  };

  return (
    <Modal isOpen={isOpen} onClose={handleSkip} title="Enable End-to-End Encryption">
      <div className="space-y-6">
        {step === 'intro' && (
          <>
            <div className="text-center">
              <ShieldCheckIcon className="mx-auto h-16 w-16 text-blue-600 dark:text-blue-400" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                Protect Your Notes
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Enable end-to-end encryption to ensure only you can read your notes.
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                How it works:
              </h4>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">🔐</span>
                  <span>All notes are encrypted on your device before syncing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">🔑</span>
                  <span>Only you have the encryption key derived from your password</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">🚫</span>
                  <span>No one else can read your notes, not even us</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ <strong>Important:</strong> If you forget your encryption password, 
                we cannot recover your notes. Make sure to save your recovery key!
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep('password')} className="flex-1">
                Enable Encryption
              </Button>
              <Button onClick={handleSkip} variant="ghost" className="flex-1">
                Skip for Now
              </Button>
            </div>
          </>
        )}

        {step === 'password' && (
          <>
            <div className="text-center">
              <KeyIcon className="mx-auto h-16 w-16 text-purple-600 dark:text-purple-400" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                Create Encryption Password
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                This password will be used to encrypt and decrypt your notes.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                type="password"
                label="Encryption Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a strong password"
                minLength={8}
                required
              />

              <Input
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                minLength={8}
                required
              />

              <div className="text-xs text-gray-600 dark:text-gray-400">
                💡 Use a strong, unique password that you'll remember
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleEnableEncryption}
                disabled={loading || !password || !confirmPassword}
                className="flex-1"
              >
                {loading ? 'Setting up...' : 'Continue'}
              </Button>
              <Button onClick={() => setStep('intro')} variant="ghost">
                Back
              </Button>
            </div>
          </>
        )}

        {step === 'recovery' && (
          <>
            <div className="text-center">
              <DocumentDuplicateIcon className="mx-auto h-16 w-16 text-green-600 dark:text-green-400" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                Save Your Recovery Key
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Use this key to recover your notes if you forget your password.
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Recovery Key
                </span>
                <Button onClick={copyRecoveryKey} size="sm" variant="ghost">
                  Copy
                </Button>
              </div>
              <code className="block break-all rounded bg-white p-3 font-mono text-xs text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                {recoveryKey}
              </code>
            </div>

            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-sm text-red-800 dark:text-red-200">
                🔴 <strong>Critical:</strong> Save this recovery key in a secure location. 
                Without it, you cannot recover your notes if you forget your password!
              </p>
            </div>

            <Button onClick={handleComplete} className="w-full">
              I've Saved My Recovery Key
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
};
