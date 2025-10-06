'use client';

import { useState, useEffect } from 'react';
import { 
  checkBiometricSupport, 
  registerBiometric, 
  storeBiometricKey,
  BiometricCapabilities 
} from '@/lib/crypto/biometric';
import { useEncryptionStore } from '@/lib/store/useEncryptionStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { FingerPrintIcon, FaceSmileIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function BiometricSetup() {
  const [isOpen, setIsOpen] = useState(false);
  const [capabilities, setCapabilities] = useState<BiometricCapabilities | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { encryptionKey } = useEncryptionStore();
  const { user } = useAuthStore();

  useEffect(() => {
    checkCapabilities();
  }, []);

  async function checkCapabilities() {
    const caps = await checkBiometricSupport();
    setCapabilities(caps);
  }

  async function handleEnableBiometric() {
    if (!user || !encryptionKey) {
      setError('User not authenticated or encryption not enabled');
      return;
    }

    setIsRegistering(true);
    setError(null);

    try {
      // Register biometric credential
      const credential = await registerBiometric(user.id);
      
      if (!credential) {
        throw new Error('Biometric registration failed');
      }

      // Store encryption key for biometric unlock
      const stored = await storeBiometricKey(user.id, encryptionKey, credential.credentialId);
      
      if (!stored) {
        throw new Error('Failed to store encryption key');
      }

      // Store credential ID in user metadata (you may want to save this to Firestore)
      localStorage.setItem(`biometric_${user.id}`, credential.credentialId);

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      console.error('Biometric setup error:', err);
      setError(err.message || 'Failed to enable biometric unlock');
    } finally {
      setIsRegistering(false);
    }
  }

  const BiometricIcon = capabilities?.type === 'face' ? FaceSmileIcon : FingerPrintIcon;

  if (!capabilities?.available) {
    return null;
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <BiometricIcon className="h-5 w-5" />
        Enable Biometric Unlock
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Enable Biometric Unlock">
        <div className="space-y-4">
          {/* Biometric Type Info */}
          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <BiometricIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {capabilities?.type === 'face' ? 'Face ID' : 'Fingerprint'} Available
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Unlock your encrypted notes with {capabilities?.type === 'face' ? 'your face' : 'your fingerprint'}
              </p>
            </div>
          </div>

          {/* How it Works */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white">How it works:</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">1.</span>
                Your encryption key is securely stored on this device
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">2.</span>
                Use biometric authentication to unlock instead of password
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">3.</span>
                Your biometric data never leaves your device
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">4.</span>
                You can still use your password as a backup
              </li>
            </ul>
          </div>

          {/* Security Notice */}
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Important:</strong> Biometric unlock is device-specific. You'll need to set it up on each device separately.
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Success Display */}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="text-sm text-green-600 dark:text-green-400">
                Biometric unlock enabled successfully!
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isRegistering}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEnableBiometric}
              disabled={isRegistering || success}
              className="flex-1"
            >
              {isRegistering ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Setting up...
                </>
              ) : success ? (
                'Enabled!'
              ) : (
                'Enable Biometric Unlock'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
