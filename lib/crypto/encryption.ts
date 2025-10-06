// End-to-end encryption utilities using Web Crypto API
// All encryption happens client-side, server never sees plaintext

const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const KEY_LENGTH = 256;

/**
 * Generate a random salt for key derivation
 */
export const generateSalt = (): Uint8Array => {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
};

/**
 * Generate a random initialization vector for encryption
 */
export const generateIV = (): Uint8Array => {
  return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
};

/**
 * Derive an encryption key from a password using PBKDF2
 */
export const deriveKey = async (
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Import password as a key
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive actual encryption key
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  );

  return key;
};

/**
 * Encrypt data using AES-GCM
 */
export const encrypt = async (
  data: string,
  key: CryptoKey
): Promise<{ ciphertext: string; iv: string }> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const iv = generateIV();

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    dataBuffer
  );

  // Convert to base64 for storage
  const ciphertext = arrayBufferToBase64(encryptedBuffer);
  const ivBase64 = arrayBufferToBase64(new Uint8Array(iv).buffer as ArrayBuffer);

  return { ciphertext, iv: ivBase64 };
};

/**
 * Decrypt data using AES-GCM
 */
export const decrypt = async (
  ciphertext: string,
  iv: string,
  key: CryptoKey
): Promise<string> => {
  const ciphertextBuffer = base64ToArrayBuffer(ciphertext);
  const ivBuffer = base64ToArrayBuffer(iv);

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: ivBuffer,
    },
    key,
    ciphertextBuffer
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
};

/**
 * Encrypt JSON data
 */
export const encryptJSON = async (
  data: any,
  key: CryptoKey
): Promise<{ ciphertext: string; iv: string }> => {
  const jsonString = JSON.stringify(data);
  return await encrypt(jsonString, key);
};

/**
 * Decrypt JSON data
 */
export const decryptJSON = async (
  ciphertext: string,
  iv: string,
  key: CryptoKey
): Promise<any> => {
  const jsonString = await decrypt(ciphertext, iv, key);
  return JSON.parse(jsonString);
};

/**
 * Export encryption key to store in memory (never to server)
 */
export const exportKey = async (key: CryptoKey): Promise<string> => {
  const exported = await crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(exported);
};

/**
 * Import encryption key from stored format
 */
export const importKey = async (keyString: string): Promise<CryptoKey> => {
  const keyBuffer = base64ToArrayBuffer(keyString);
  return await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-GCM', length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  );
};

/**
 * Hash a password for verification (not for encryption)
 */
export const hashPassword = async (password: string, salt: Uint8Array): Promise<string> => {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    256
  );

  return arrayBufferToBase64(hashBuffer);
};

// Utility functions for encoding/decoding
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
};

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * Convert Uint8Array to base64 for storage
 */
export const saltToBase64 = (salt: Uint8Array): string => {
  return arrayBufferToBase64(salt.buffer as ArrayBuffer);
};

/**
 * Convert base64 back to Uint8Array
 */
export const base64ToSalt = (base64: string): Uint8Array => {
  return new Uint8Array(base64ToArrayBuffer(base64));
};

/**
 * Generate a secure random password for backup purposes
 */
export const generateRecoveryKey = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};
