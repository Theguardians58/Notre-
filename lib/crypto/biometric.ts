/**
 * Biometric Authentication Utilities
 * Provides fingerprint/face unlock for encryption key access
 */

export interface BiometricCapabilities {
  available: boolean;
  type: 'fingerprint' | 'face' | 'iris' | 'none';
  platform: 'web' | 'ios' | 'android';
}

/**
 * Check if biometric authentication is available
 */
export async function checkBiometricSupport(): Promise<BiometricCapabilities> {
  // Check for Web Authentication API (WebAuthn)
  if (typeof window === 'undefined') {
    return { available: false, type: 'none', platform: 'web' };
  }

  // Check if PublicKeyCredential is available (WebAuthn support)
  if (!window.PublicKeyCredential) {
    return { available: false, type: 'none', platform: 'web' };
  }

  // Check for platform authenticator (biometric)
  try {
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    
    if (available) {
      // Detect biometric type based on platform
      const userAgent = navigator.userAgent.toLowerCase();
      let type: 'fingerprint' | 'face' | 'iris' = 'fingerprint';
      
      if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
        // iOS devices with Face ID or Touch ID
        type = userAgent.includes('iphone x') || userAgent.includes('iphone 1') ? 'face' : 'fingerprint';
      } else if (userAgent.includes('android')) {
        type = 'fingerprint'; // Most Android devices use fingerprint
      } else if (userAgent.includes('mac')) {
        type = 'fingerprint'; // MacBooks with Touch ID
      }

      return {
        available: true,
        type,
        platform: 'web',
      };
    }
  } catch (error) {
    console.error('Biometric check failed:', error);
  }

  return { available: false, type: 'none', platform: 'web' };
}

/**
 * Register biometric authentication for a user
 */
export async function registerBiometric(userId: string): Promise<{ credentialId: string; publicKey: string } | null> {
  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const publicKeyOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: 'CogniNote',
        id: window.location.hostname,
      },
      user: {
        id: new TextEncoder().encode(userId),
        name: userId,
        displayName: 'CogniNote User',
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Platform authenticator (biometric)
        userVerification: 'required',
        requireResidentKey: false,
      },
      timeout: 60000,
      attestation: 'none',
    };

    const credential = await navigator.credentials.create({
      publicKey: publicKeyOptions,
    }) as PublicKeyCredential;

    if (!credential) {
      return null;
    }

    // Extract credential ID and public key
    const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
    const response = credential.response as AuthenticatorAttestationResponse;
    const publicKey = btoa(String.fromCharCode(...new Uint8Array(response.getPublicKey()!)));

    return { credentialId, publicKey };
  } catch (error) {
    console.error('Biometric registration failed:', error);
    return null;
  }
}

/**
 * Authenticate using biometric
 */
export async function authenticateBiometric(credentialId: string): Promise<boolean> {
  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    // Convert base64 credential ID back to ArrayBuffer
    const credentialIdBytes = Uint8Array.from(atob(credentialId), c => c.charCodeAt(0));

    const publicKeyOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      allowCredentials: [
        {
          id: credentialIdBytes,
          type: 'public-key',
          transports: ['internal'], // Platform authenticator
        },
      ],
      userVerification: 'required',
      timeout: 60000,
    };

    const assertion = await navigator.credentials.get({
      publicKey: publicKeyOptions,
    }) as PublicKeyCredential;

    return !!assertion;
  } catch (error) {
    console.error('Biometric authentication failed:', error);
    return false;
  }
}

/**
 * Store encryption key securely for biometric unlock
 * Uses IndexedDB with encryption
 */
export async function storeBiometricKey(userId: string, encryptionKey: CryptoKey, credentialId: string): Promise<boolean> {
  try {
    // Open IndexedDB
    const db = await openBiometricDB();
    
    // Export encryption key
    const exportedKey = await crypto.subtle.exportKey('raw', encryptionKey);
    
    // Encrypt the key with a device-specific key
    const deviceKey = await deriveDeviceKey(credentialId);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedKey = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      deviceKey,
      exportedKey
    );

    // Store in IndexedDB
    const transaction = db.transaction(['biometric-keys'], 'readwrite');
    const store = transaction.objectStore('biometric-keys');
    const request = store.put({
      userId,
      credentialId,
      encryptedKey: Array.from(new Uint8Array(encryptedKey)),
      iv: Array.from(iv),
      timestamp: Date.now(),
    });

    await new Promise<void>((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    return true;
  } catch (error) {
    console.error('Failed to store biometric key:', error);
    return false;
  }
}

/**
 * Retrieve encryption key using biometric authentication
 */
export async function retrieveBiometricKey(userId: string, credentialId: string): Promise<CryptoKey | null> {
  try {
    // Authenticate with biometric first
    const authenticated = await authenticateBiometric(credentialId);
    if (!authenticated) {
      return null;
    }

    // Open IndexedDB
    const db = await openBiometricDB();
    
    // Retrieve encrypted key
    const transaction = db.transaction(['biometric-keys'], 'readonly');
    const store = transaction.objectStore('biometric-keys');
    const request = store.get(userId);
    
    const data = await new Promise<any>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (!data) {
      return null;
    }

    // Decrypt the key
    const deviceKey = await deriveDeviceKey(credentialId);
    const encryptedKey = new Uint8Array(data.encryptedKey);
    const iv = new Uint8Array(data.iv);

    const decryptedKey = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      deviceKey,
      encryptedKey
    );

    // Import back to CryptoKey
    const encryptionKey = await crypto.subtle.importKey(
      'raw',
      decryptedKey,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    );

    return encryptionKey;
  } catch (error) {
    console.error('Failed to retrieve biometric key:', error);
    return null;
  }
}

/**
 * Remove biometric key from storage
 */
export async function removeBiometricKey(userId: string): Promise<boolean> {
  try {
    const db = await openBiometricDB();
    const transaction = db.transaction(['biometric-keys'], 'readwrite');
    const store = transaction.objectStore('biometric-keys');
    const request = store.delete(userId);
    
    await new Promise<void>((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    
    return true;
  } catch (error) {
    console.error('Failed to remove biometric key:', error);
    return false;
  }
}

/**
 * Helper: Open IndexedDB for biometric key storage
 */
function openBiometricDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CogniNoteBiometric', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('biometric-keys')) {
        db.createObjectStore('biometric-keys', { keyPath: 'userId' });
      }
    };
  });
}

/**
 * Helper: Derive a device-specific key for encrypting the stored encryption key
 */
async function deriveDeviceKey(credentialId: string): Promise<CryptoKey> {
  // Use credential ID as part of key derivation
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(credentialId + navigator.userAgent),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const salt = encoder.encode('cogninote-biometric-salt');

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Check if user has biometric enabled
 */
export async function hasBiometricEnabled(userId: string): Promise<boolean> {
  try {
    const db = await openBiometricDB();
    const transaction = db.transaction(['biometric-keys'], 'readonly');
    const store = transaction.objectStore('biometric-keys');
    const request = store.get(userId);
    
    const data = await new Promise<any>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    return !!data;
  } catch (error) {
    return false;
  }
}
