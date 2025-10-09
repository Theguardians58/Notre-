# 🔧 Appwrite Method Name Corrections

**Common Appwrite SDK method name differences**

---

## 📋 Issues Found

Based on Appwrite SDK (latest versions), here are the method name corrections needed:

---

## 🔐 Authentication (`lib/appwrite/auth.ts`)

### ✅ Correct Methods (Already Using)

- ✅ `account.create()` - Create user
- ✅ `account.createEmailPasswordSession()` - Email/password login (v14+)
  - **Old name**: `account.createEmailSession()` (deprecated)
- ✅ `account.createOAuth2Session()` - OAuth login
- ✅ `account.get()` - Get current user
- ✅ `account.deleteSession()` - Logout
- ✅ `account.updateName()` - Update profile name
- ✅ `account.updateEmail()` - Update email
- ✅ `account.updatePassword()` - Update password
- ✅ `account.createRecovery()` - Send password reset
- ✅ `account.updateRecovery()` - Complete password reset
- ✅ `account.listSessions()` - Get all sessions

**Status**: ✅ All auth methods correct!

---

## 📊 Database (`lib/appwrite/database.ts`)

### ✅ Correct Methods

- ✅ `databases.createDocument()` - Create document
- ✅ `databases.getDocument()` - Get single document
- ✅ `databases.listDocuments()` - List documents with queries
- ✅ `databases.updateDocument()` - Update document
- ✅ `databases.deleteDocument()` - Delete document

### ⚠️ Potential Issues

**Query methods:**
- ✅ `Query.equal()` - Correct
- ✅ `Query.orderDesc()` - Correct
- ✅ `Query.limit()` - Correct
- ✅ `Query.search()` - Correct

**Status**: ✅ All database methods correct!

---

## 📦 Storage (`lib/appwrite/storage.ts`)

### ⚠️ Methods to Verify

Current code uses:
```typescript
storage.getFileView(bucketId, fileId).toString()
storage.getFileDownload(bucketId, fileId).toString()
storage.getFilePreview(bucketId, fileId, width, height).toString()
```

### ✅ Correct Usage (Appwrite SDK 14+)

These methods return `URL` objects, so `.toString()` is correct!

However, the **correct method names** are:

```typescript
// ✅ View file (inline in browser)
storage.getFileView(bucketId, fileId)

// ✅ Download file
storage.getFileDownload(bucketId, fileId)

// ✅ Preview/thumbnail (for images)
storage.getFilePreview(bucketId, fileId, width?, height?, gravity?, quality?, borderWidth?, borderColor?, borderRadius?, opacity?, rotation?, background?)
```

**All storage methods are correct!**

---

## 🔄 Real-time (`lib/appwrite/database.ts`)

### Current Code (Subscription)

```typescript
client.subscribe(`databases.${databaseId}.collections.${collectionId}.documents.${documentId}`, ...)
```

### ✅ Correct Channel Format

For Appwrite SDK 14+:
```typescript
// Single document
`databases.${databaseId}.collections.${collectionId}.documents.${documentId}`

// All documents in collection
`databases.${databaseId}.collections.${collectionId}.documents`

// Specific fields
`databases.${databaseId}.collections.${collectionId}.documents.${documentId}.title`
```

**Status**: ✅ Real-time subscription format correct!

---

## 📝 Summary of Changes Needed

### ✅ Already Correct

All methods in your code are using the **correct names** for Appwrite SDK v14+!

However, here are some **alternative names** you might encounter:

### 📚 Method Name Alternatives

| Our Code | Also Known As | SDK Version |
|----------|---------------|-------------|
| `createEmailPasswordSession` | `createEmailSession` | v14+ (current is correct) |
| `getFileView` | - | Correct |
| `getFileDownload` | - | Correct |
| `listDocuments` | - | Correct |
| `updateRecovery` | - | Correct (3 params) |

---

## 🛠️ If You're Using Older Appwrite SDK

If you're using Appwrite SDK **< v14**, change:

```typescript
// OLD (SDK < 14)
await account.createEmailSession(email, password);

// NEW (SDK 14+) - ✅ Your code already uses this!
await account.createEmailPasswordSession(email, password);
```

---

## ✅ Verification Checklist

Run this to verify your Appwrite SDK version:

```bash
npm list appwrite
```

**Recommended version**: `14.0.0` or higher

Your code is compatible with:
- ✅ Appwrite SDK 14.x
- ✅ Appwrite SDK 15.x
- ✅ Appwrite Cloud
- ✅ Self-hosted Appwrite 1.4+

---

## 🔍 Common Differences from Firebase

If migrating from Firebase, note these differences:

| Firebase | Appwrite Equivalent |
|----------|-------------------|
| `signInWithEmailAndPassword` | `createEmailPasswordSession` |
| `createUserWithEmailAndPassword` | `account.create()` + `createEmailPasswordSession` |
| `signOut` | `deleteSession('current')` |
| `sendPasswordResetEmail` | `createRecovery` |
| `updateProfile` | `updateName` / `updateEmail` |
| `collection().doc().set()` | `createDocument` |
| `collection().doc().update()` | `updateDocument` |
| `collection().doc().delete()` | `deleteDocument` |
| `where('field', '==', value)` | `Query.equal('field', value)` |
| `orderBy('field', 'desc')` | `Query.orderDesc('field')` |
| `limit(10)` | `Query.limit(10)` |

---

## 🚀 If Experiencing Issues

### Issue 1: Method Not Found

**Error**: `account.createEmailPasswordSession is not a function`

**Fix**: Update Appwrite SDK
```bash
npm install appwrite@latest --legacy-peer-deps
```

### Issue 2: Wrong Number of Parameters

**Error**: `Expected 3 arguments, but got 4`

**Fix**: Check method signature in docs
- Example: `updateRecovery(userId, secret, password)` - 3 params, not 4

### Issue 3: Return Type Issues

**Error**: URL methods return undefined

**Fix**: Ensure you're calling `.toString()` on URL objects:
```typescript
const url = storage.getFileView(bucketId, fileId);
const urlString = url.toString(); // ✅ Correct
```

---

## 📖 Official Appwrite SDK Reference

- **Appwrite Docs**: https://appwrite.io/docs
- **Account API**: https://appwrite.io/docs/references/cloud/client-web/account
- **Databases API**: https://appwrite.io/docs/references/cloud/client-web/databases
- **Storage API**: https://appwrite.io/docs/references/cloud/client-web/storage
- **Realtime API**: https://appwrite.io/docs/apis/realtime

---

## ✅ Current Status

**Your Appwrite integration uses correct method names!** ✨

All methods are compatible with:
- Appwrite SDK 14.0+
- Appwrite SDK 15.0+
- Appwrite Cloud
- Self-hosted Appwrite 1.4+

**No changes needed unless you're using an older SDK version.**

---

**Last Updated**: October 2025  
**Appwrite SDK Version**: 14.0+ / 15.0+
