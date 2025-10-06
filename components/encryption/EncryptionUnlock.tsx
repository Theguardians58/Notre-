// Unlock encryption after login
'use client';

import { FC, useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { deriveKey, base64ToSalt, hashPassword } from '@/lib/crypto/encryption';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useEncryptionStore } from '@/lib/store/useEncryptionStore';
import BiometricUnlock from './BiometricUnlock';
import { checkBiometricSupport, hasBiometricEnabled } from '@/lib/crypto/biometric';
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
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState<'fingerprint' | 'face'>('fingerprint');
  const { user } = useAuthStore();
  const { setEncryptionKey } = useEncryptionStore();

  useEffect(() => {
    checkBiometricAvailability();
  }, [user]);

  async function checkBiometricAvailability() {
    if (!user) return;

    const capabilities = await checkBiometricSupport();
    setBiometricAvailable(capabilities.available);
    setBiometricType(capabilities.type as 'fingerprint' | 'face');

    if (capabilities.available) {
      const enabled = await hasBiometricEnabled(user.id);
      setBiometricEnabled(enabled);
    }
  }

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

        {/* Biometric Unlock Option */}
        {biometricAvailable && biometricEnabled && (
          <>
            <BiometricUnlock 
              onSuccess={onUnlock} 
              biometricType={biometricType}
            />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or use password
                </span>
              </div>
            </div>
          </>
        )}

        <Input
          type="password"
          label="Encryption Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your encryption password"
          autoFocus={!biometricEnabled}
          required
        />

        <div className="flex gap-3">
          <Button
            onClick={handleUnlock}
            disabled={loading || !password}
            className="flex-1"
          >
            {loading ? 'Unlocking...' : (biometricEnabled ? 'Unlock with Password' : 'Unlock')}
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
