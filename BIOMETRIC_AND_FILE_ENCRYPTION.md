# 🔐 Biometric Unlock & Encrypted File Attachments

**Added**: October 2025  
**Version**: v2.1.1

---

## 🎯 New Features

### 1. Biometric Unlock for Encryption
Unlock your encrypted notes using fingerprint or face recognition instead of typing your password every time.

### 2. Encrypted File Attachments
Upload and attach files to your notes with automatic end-to-end encryption.

---

## 🖐️ Biometric Unlock

### What is it?
Biometric unlock allows you to use your device's built-in fingerprint scanner or face recognition (Face ID/Touch ID) to unlock your encrypted notes quickly and securely.

### How it Works

1. **One-Time Setup**
   - Enable encryption first (if not already enabled)
   - Go to Settings → Encryption
   - Click "Enable Biometric Unlock"
   - Authenticate with your biometric (fingerprint/face)
   - Your encryption key is securely stored on your device

2. **Unlocking**
   - When you log in, you'll see a biometric unlock option
   - Touch the fingerprint sensor or look at the camera
   - Instantly unlock your encrypted notes
   - No need to type your password!

3. **Fallback to Password**
   - Your password still works as a backup
   - Use it on devices without biometric
   - Use it if biometric fails

### Security

- **Device-Specific**: Biometric unlock is set up per device
- **Secure Storage**: Encryption key encrypted with device-specific key in IndexedDB
- **Zero-Knowledge**: Your biometric data never leaves your device
- **WebAuthn Standard**: Uses W3C Web Authentication API (WebAuthn)
- **Platform Authenticator**: Only works with built-in biometric sensors

### Supported Devices

✅ **Desktop**
- MacBook with Touch ID
- Windows laptops with fingerprint sensors
- Windows Hello (face recognition)

✅ **Mobile**
- iOS devices with Touch ID or Face ID
- Android devices with fingerprint sensors
- Android devices with face unlock

✅ **Browsers**
- Chrome/Edge 67+
- Safari 14+
- Firefox 60+

### Setup Instructions

1. **Enable Encryption** (if not already enabled)
   ```
   Settings → Encryption → Enable End-to-End Encryption
   ```

2. **Set Up Biometric**
   ```
   Settings → Encryption → Enable Biometric Unlock
   ```

3. **Authenticate**
   - Your browser will prompt for biometric authentication
   - Touch fingerprint sensor or look at camera
   - Your encryption key is now accessible via biometric

4. **Test It**
   - Log out and log back in
   - Click "Unlock with Fingerprint/Face ID"
   - Authenticate with your biometric

### Disable Biometric

To remove biometric unlock:
```
Settings → Encryption → Disable Biometric Unlock
```

Your password will still work to unlock encryption.

---

## 📎 Encrypted File Attachments

### What is it?
Upload files (images, PDFs, documents) to your notes with automatic client-side encryption. Files are encrypted before upload and can only be decrypted by you.

### Supported File Types

- **Images**: JPG, PNG, GIF, WebP, SVG
- **Documents**: PDF, DOC, DOCX, TXT, MD
- **Spreadsheets**: XLS, XLSX, CSV
- **Presentations**: PPT, PPTX
- **Archives**: ZIP, RAR, 7Z
- **Any other file type** (up to 100 MB)

### How it Works

1. **Upload**
   - Open a note with encryption enabled and unlocked
   - Click the "Upload File" button
   - Select your file
   - File is encrypted on your device using AES-256-GCM
   - Encrypted file is uploaded to Firebase Storage
   - Metadata stored in your note

2. **View/Download**
   - Encrypted file is downloaded from storage
   - Decrypted on your device using your encryption key
   - Original file is restored and opened/downloaded

3. **Share**
   - Encrypted files can only be accessed with your encryption key
   - If you share a note, recipients need your encryption key to decrypt files

### Security Features

- **Client-Side Encryption**: Files never uploaded in plaintext
- **AES-256-GCM**: Military-grade encryption
- **Unique IV**: Each file has its own initialization vector
- **Encrypted Metadata**: File names and types are also encrypted
- **Zero-Knowledge**: Server cannot read your files
- **Secure Storage**: Encrypted files stored in Firebase Storage

### Usage

**In Note Editor:**
```tsx
import EncryptedFileUpload from '@/components/editor/EncryptedFileUpload';

<EncryptedFileUpload 
  noteId={note.id}
  onFileUploaded={(url, metadata) => {
    // Add file to note
  }}
  maxSize={100 * 1024 * 1024} // 100 MB
/>
```

**Upload Files:**
1. Ensure encryption is unlocked
2. Click file upload button in editor
3. Select file
4. File automatically encrypts and uploads
5. Progress bar shows encryption + upload status

**Download Files:**
1. Click on attached file in note
2. File automatically downloads and decrypts
3. Original file opens in browser or downloads

### File Size Limits

- **Default**: 100 MB per file
- **Large Files**: Chunked encryption for files > 10 MB
- **Storage**: Depends on your Firebase plan
  - Free: 5 GB total storage
  - Blaze (Pay-as-you-go): Unlimited (you pay for storage)

### Metadata Structure

```typescript
interface FileAttachment {
  id: string;              // Unique file ID
  name: string;            // Original filename
  url: string;             // URL to encrypted file
  mimeType: string;        // Original MIME type
  size: number;            // Original file size (bytes)
  encryptedSize: number;   // Encrypted file size (bytes)
  encrypted: boolean;      // Always true for encrypted files
  iv: number[];            // Initialization vector for decryption
  uploadedAt: Date;        // Upload timestamp
}
```

### API Usage

**Encrypt File:**
```typescript
import { encryptFile } from '@/lib/crypto/file-encryption';

const file = // File from input
const encryptionKey = // Your CryptoKey

const { encryptedData, metadata } = await encryptFile(file, encryptionKey);
```

**Decrypt File:**
```typescript
import { decryptFile } from '@/lib/crypto/file-encryption';

const encryptedBlob = // Blob from storage
const metadata = // Stored metadata
const encryptionKey = // Your CryptoKey

const originalFile = await decryptFile(encryptedBlob, metadata, encryptionKey);
```

**Bulk Operations:**
```typescript
// Encrypt multiple files
const encryptedFiles = await encryptFiles(files, encryptionKey, (current, total) => {
  console.log(`Encrypted ${current}/${total}`);
});

// Decrypt multiple files
const decryptedFiles = await decryptFiles(encryptedFiles, encryptionKey);
```

---

## 🔒 Security Considerations

### Biometric Security

✅ **Pros:**
- Convenient and fast
- More secure than weak passwords
- Device-specific (can't be remotely compromised)
- Biometric data never leaves device

⚠️ **Cons:**
- Device-specific (need to set up on each device)
- Depends on device security
- Can't use on devices without biometric

**Best Practices:**
- Use strong encryption password as backup
- Keep recovery key safe
- Don't share device with others
- Use device lock screen

### File Encryption Security

✅ **Pros:**
- Client-side encryption (zero-knowledge)
- AES-256-GCM (military-grade)
- Unique IV per file
- Encrypted file names

⚠️ **Cons:**
- File size increases ~16 bytes (GCM tag + IV)
- Requires encryption key to access
- Cannot recover if key is lost

**Best Practices:**
- Don't upload sensitive files on public networks without VPN
- Back up your encryption key/recovery key
- Use strong encryption password
- Be aware of file size limits

---

## 🚨 Important Notes

### Biometric Unlock

1. **Device-Specific**
   - Set up biometric on each device separately
   - Mobile app, desktop browser, etc. all need separate setup

2. **Browser Support**
   - Requires modern browser with WebAuthn support
   - Some browsers may not support all biometric types

3. **Password Backup**
   - Always keep your password safe
   - Biometric is convenience, not a replacement

### Encrypted Files

1. **Storage Costs**
   - Encrypted files count toward Firebase storage quota
   - Monitor your usage on Firebase Console

2. **Performance**
   - Large files take longer to encrypt/decrypt
   - Use Wi-Fi for large file uploads

3. **Compatibility**
   - Encrypted files can only be opened with encryption key
   - Sharing encrypted notes requires sharing encryption key

---

## 📊 Technical Details

### Biometric Implementation

**Technologies Used:**
- W3C Web Authentication API (WebAuthn)
- PublicKeyCredential API
- IndexedDB for secure storage
- PBKDF2 for key derivation

**Flow:**
1. User enables biometric
2. Browser creates public/private key pair
3. Private key stored in device's secure enclave
4. Encryption key encrypted with derived device key
5. Encrypted key stored in IndexedDB
6. On unlock, biometric authenticates and retrieves key

### File Encryption Implementation

**Technologies Used:**
- Web Crypto API
- AES-256-GCM encryption
- Unique IV per file
- Firebase Storage

**Flow:**
1. User selects file
2. File read as ArrayBuffer
3. Generate unique IV (12 bytes)
4. Encrypt with AES-GCM
5. Upload encrypted blob
6. Store metadata (IV, filename, size)

---

## 🎯 Use Cases

### Biometric Unlock

✅ **Good For:**
- Quick access on trusted devices
- Frequent note-taking throughout the day
- Mobile devices with biometric
- Convenience without sacrificing security

❌ **Not Ideal For:**
- Shared devices
- Public/work computers
- Devices without biometric support
- Paranoid security requirements

### Encrypted File Attachments

✅ **Good For:**
- Storing sensitive documents
- Attaching receipts, invoices
- Medical records
- Legal documents
- Personal photos
- Confidential work files

❌ **Not Ideal For:**
- Very large files (> 100 MB)
- Frequent access by multiple people
- Public sharing
- Real-time collaboration

---

## 🔄 Migration Guide

### Existing Users

If you already have encryption enabled:

1. **Add Biometric Unlock:**
   ```
   Settings → Encryption → Enable Biometric Unlock
   ```

2. **Encrypt Existing Files:**
   - Files uploaded before this feature remain unencrypted
   - Re-upload important files for encryption
   - Or use bulk migration tool (coming soon)

### New Users

1. Enable encryption during signup
2. Set up biometric unlock immediately
3. All files uploaded will be encrypted automatically

---

## ❓ FAQs

### Q: Can I use biometric unlock on multiple devices?
**A:** Yes, but you need to set it up separately on each device.

### Q: What happens if my fingerprint/face changes?
**A:** Update your biometric in device settings. You can still use your password.

### Q: Can I share encrypted files with others?
**A:** Yes, but they need your encryption key to decrypt them.

### Q: What's the maximum file size?
**A:** Default is 100 MB per file. This can be increased if needed.

### Q: Are file names encrypted?
**A:** Yes, file metadata (name, type, size) is encrypted and stored separately.

### Q: Can I disable biometric after enabling it?
**A:** Yes, go to Settings → Encryption → Disable Biometric Unlock.

### Q: What if I lose my encryption key?
**A:** Use your recovery key. If both are lost, files cannot be recovered.

### Q: Does biometric work offline?
**A:** Biometric authentication works offline, but you need internet to sync notes.

---

## 🛠️ Troubleshooting

### Biometric Issues

**Problem**: Biometric option doesn't appear
- **Solution**: Check browser support, ensure biometric is set up on device

**Problem**: Biometric authentication fails
- **Solution**: Use password fallback, re-register biometric

**Problem**: "Biometric not supported" error
- **Solution**: Your device/browser doesn't support WebAuthn

### File Upload Issues

**Problem**: File upload fails
- **Solution**: Check file size, ensure encryption is unlocked

**Problem**: Cannot decrypt file
- **Solution**: Ensure you're using the correct encryption key

**Problem**: File too large error
- **Solution**: File exceeds 100 MB limit, compress or split file

---

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/Theguardians58/Notre-/issues
- Check ENCRYPTION_GUIDE.md for general encryption help
- See KNOWN_ISSUES_AND_FIXES.md for common problems

---

**Security Notice**: These features enhance your privacy and security, but remember to always keep your encryption password and recovery key safe. Biometric is a convenience feature, not a replacement for strong password security.

---

**Version**: v2.1.1  
**Last Updated**: October 2025  
**Main Repository**: https://github.com/Theguardians58/Notre-
