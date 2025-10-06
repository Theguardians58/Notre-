// Unlock encryption after login
'use client';

import { FC, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { deriveKey, base64ToSalt, hashPassword } from '@/lib/crypto/encryption';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useEncryptionStore } from '@/lib/store/useEncryptionStore';
import toast from 'react-hot-toast';
import { LockClosedIcon } from '@heroicons/react/24/outline';

interface EncryptionUnlockProps {
  isOpen: boolean;
  onUnlock: () => void;
  onSkip?: () => void;
}

export const EncryptionUnlock: FC<EncryptionUnlockProps> = ({ 
  isOpen, 
  onUnlock,
  onSkip 
}) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const { setEncryptionKey } = useEncryptionStore();

  const handleUnlock = async () => {
    if (!user || !user.encryption?.enabled) return;

    setLoading(true);

    try {
      // Derive key from password
      const salt = base64ToSalt(user.encryption.salt);
      const encryptionKey = await deriveKey(password, salt);

      // Verify password by comparing hash
      const passwordHashValue = await hashPassword(password, salt);
      
      if (passwordHashValue !== user.encryption.passwordHash) {
        toast.error('Incorrect password');
        setLoading(false);
        return;
      }

      // Store key in memory
      setEncryptionKey(encryptionKey);
      
      toast.success('Encryption unlocked');
      setPassword('');
      onUnlock();
    } catch (error) {
      console.error('Unlock error:', error);
      toast.error('Failed to unlock encryption');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUnlock();
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onSkip || (() => {})} 
      title="Unlock Encrypted Notes"
    >
      <div className="space-y-6">
        <div className="text-center">
          <LockClosedIcon className="mx-auto h-16 w-16 text-blue-600 dark:text-blue-400" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
            Enter Encryption Password
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Your notes are encrypted. Enter your password to unlock them.
          </p>
        </div>

        <Input
          type="password"
          label="Encryption Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your encryption password"
          autoFocus
          required
        />

        <div className="flex gap-3">
          <Button
            onClick={handleUnlock}
            disabled={loading || !password}
            className="flex-1"
          >
            {loading ? 'Unlocking...' : 'Unlock'}
          </Button>
          {onSkip && (
            <Button onClick={onSkip} variant="ghost">
              Skip
            </Button>
          )}
        </div>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <button className="text-blue-600 hover:underline dark:text-blue-400">
            Forgot password? Use recovery key
          </button>
        </div>
      </div>
    </Modal>
  );
};
