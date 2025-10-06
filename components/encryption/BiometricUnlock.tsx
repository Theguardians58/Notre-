'use client';

import { useState } from 'react';
import { retrieveBiometricKey } from '@/lib/crypto/biometric';
import { useEncryptionStore } from '@/lib/store/useEncryptionStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { FingerPrintIcon, FaceSmileIcon } from '@heroicons/react/24/outline';

interface BiometricUnlockProps {
  onSuccess?: () => void;
  biometricType?: 'fingerprint' | 'face';
}

export default function BiometricUnlock({ onSuccess, biometricType = 'fingerprint' }: BiometricUnlockProps) {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setEncryptionKey } = useEncryptionStore();
  const { user } = useAuthStore();

  async function handleBiometricUnlock() {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setIsUnlocking(true);
    setError(null);

    try {
      // Get stored credential ID
      const credentialId = localStorage.getItem(`biometric_${user.id}`);
      
      if (!credentialId) {
        throw new Error('Biometric not set up for this account');
      }

      // Retrieve encryption key using biometric
      const key = await retrieveBiometricKey(user.id, credentialId);
      
      if (!key) {
        throw new Error('Biometric authentication failed');
      }

      // Set encryption key in store
      setEncryptionKey(key);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Biometric unlock error:', err);
      setError(err.message || 'Biometric unlock failed');
    } finally {
      setIsUnlocking(false);
    }
  }

  const BiometricIcon = biometricType === 'face' ? FaceSmileIcon : FingerPrintIcon;

  return (
    <div className="space-y-4">
      <Button
        onClick={handleBiometricUnlock}
        disabled={isUnlocking}
        className="w-full flex items-center justify-center gap-2 py-3"
        variant="primary"
      >
        <BiometricIcon className="h-6 w-6" />
        {isUnlocking ? 'Authenticating...' : `Unlock with ${biometricType === 'face' ? 'Face ID' : 'Fingerprint'}`}
      </Button>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 text-center">
          {error}
        </p>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Touch the sensor to unlock your encrypted notes
      </p>
    </div>
  );
}
