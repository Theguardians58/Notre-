# 🗂️ Appwrite Collection Setup Guide

**Step-by-step guide to create collections in Appwrite Dashboard**

---

## 🎯 The Issue

When you go to Appwrite dashboard, you might not see a direct "Create Collection" button. Here's the correct way to do it:

---

## ✅ CORRECT Steps to Create Collections

### Step 1: Create Database FIRST

**You must create a database before you can create collections!**

1. **Login to Appwrite Dashboard**
   - Appwrite Cloud: https://cloud.appwrite.io/
   - Self-hosted: http://localhost/console (or your domain)

2. **Select Your Project**
   - Click on your CogniNote project

3. **Go to Databases Section**
   - Click **"Databases"** in the left sidebar
   - NOT "Collections" (that option might not exist yet)

4. **Create a New Database**
   - Click the **"+ Create database"** button (top right)
   - Enter database details:
     ```
     Database ID: cogninote_db
     Database Name: CogniNote Database
     ```
   - Click **"Create"**

---

### Step 2: Create Collections INSIDE the Database

**Now you can create collections!**

1. **Open Your Database**
   - Click on the database you just created (`cogninote_db`)

2. **You'll Now See "Create Collection" Button**
   - Click **"+ Create collection"** (top right)

3. **Create "notes" Collection**
   ```
   Collection ID: notes
   Collection Name: Notes
   ```
   - Click **"Create"**

4. **Add Attributes to Notes Collection**
   
   After creating the collection, click on it and add these attributes:

   **Click "+ Create attribute" for each:**

   | Attribute Key | Type | Size | Required | Default | Array |
   |--------------|------|------|----------|---------|-------|
   | `title` | String | 255 | ✅ Yes | - | ❌ No |
   | `content` | String | 1000000 | ✅ Yes | - | ❌ No |
   | `type` | String | 50 | ✅ Yes | `document` | ❌ No |
   | `ownerId` | String | 255 | ✅ Yes | - | ❌ No |
   | `parentNoteId` | String | 255 | ❌ No | - | ❌ No |
   | `emoji` | String | 10 | ❌ No | `📄` | ❌ No |
   | `encrypted` | Boolean | - | ❌ No | `false` | ❌ No |
   | `iv` | String | 255 | ❌ No | - | ❌ No |
   | `tags` | String | 50 | ❌ No | - | ✅ Yes |
   | `attachments` | String | 5000 | ❌ No | - | ✅ Yes |
   | `isPublic` | Boolean | - | ❌ No | `false` | ❌ No |
   | `createdAt` | String (DateTime) | 255 | ✅ Yes | - | ❌ No |
   | `updatedAt` | String (DateTime) | 255 | ✅ Yes | - | ❌ No |

5. **Create Indexes for Better Performance**
   
   Click **"Indexes"** tab → **"+ Create index"**

   ```
   Index 1:
   - Index Key: owner_index
   - Type: Key
   - Attributes: ownerId (ASC)

   Index 2:
   - Index Key: updated_index
   - Type: Key
   - Attributes: updatedAt (DESC)

   Index 3:
   - Index Key: type_index
   - Type: Key
   - Attributes: type (ASC)
   ```

6. **Set Permissions**
   
   Click **"Settings"** tab → **"Permissions"**

   **Document Security (Recommended):**
   ```
   Read Access: Any
   Create Access: Users
   Update Access: Users
   Delete Access: Users
   ```

   **Or for more security:**
   ```
   Read Access: Users
   Create Access: Users
   Update Access: Users
   Delete Access: Users
   ```

---

### Step 3: Create Additional Collections (Optional)

Repeat Step 2 for these collections if needed:

#### **users** Collection (for user profiles)

```
Collection ID: users
Collection Name: Users
```

**Attributes:**
| Attribute Key | Type | Size | Required | Default |
|--------------|------|------|----------|---------|
| `userId` | String | 255 | ✅ Yes | - |
| `email` | String | 255 | ✅ Yes | - |
| `displayName` | String | 255 | ✅ Yes | - |
| `photoURL` | String | 500 | ❌ No | - |
| `encryptionEnabled` | Boolean | - | ❌ No | `false` |
| `encryptionSalt` | String | 255 | ❌ No | - |
| `createdAt` | String | 255 | ✅ Yes | - |

#### **presence** Collection (for real-time collaboration)

```
Collection ID: presence
Collection Name: Presence
```

**Attributes:**
| Attribute Key | Type | Size | Required |
|--------------|------|------|----------|
| `userId` | String | 255 | ✅ Yes |
| `noteId` | String | 255 | ✅ Yes |
| `userName` | String | 255 | ✅ Yes |
| `userPhoto` | String | 500 | ❌ No |
| `isEditing` | Boolean | - | ❌ No |
| `lastSeen` | String | 255 | ✅ Yes |

---

## 📸 Visual Guide

### Where to Find Database Section

```
Appwrite Dashboard
│
├── 🏠 Overview
├── 🔐 Auth
├── 📊 Databases  ← Click here!
│   │
│   └── + Create database  ← Click this first!
│       │
│       └── [Your Database]
│           │
│           └── + Create collection  ← Now visible!
│
├── 💾 Storage
├── ⚡ Functions
└── ⚙️ Settings
```

---

## 🔧 Common Issues & Solutions

### Issue 1: Can't See "Create Collection"

**Problem:** No "Create Collection" button visible

**Solution:** 
1. Make sure you created a **database** first
2. Open the database
3. Now the "Create Collection" button will appear

### Issue 2: "Collection ID already exists"

**Problem:** Error when creating collection

**Solution:**
- Use a unique ID like `notes_v2` or delete the existing collection

### Issue 3: Attribute Creation Fails

**Problem:** Can't add attributes

**Solution:**
- Make sure the collection is created first
- Wait a few seconds for the collection to be ready
- Refresh the page

### Issue 4: Can't Find Database Section

**Problem:** No "Databases" in sidebar

**Solution:**
- You might be in the old Appwrite console
- Update to latest Appwrite version
- Or use Appwrite Cloud (always latest)

---

## 🚀 Quick Setup Script (Alternative)

If the UI is confusing, you can use the Appwrite CLI:

### Install Appwrite CLI

```bash
npm install -g appwrite-cli
```

### Login to Appwrite

```bash
appwrite login
```

### Create Database

```bash
appwrite databases create \
  --databaseId cogninote_db \
  --name "CogniNote Database"
```

### Create Notes Collection

```bash
appwrite databases createCollection \
  --databaseId cogninote_db \
  --collectionId notes \
  --name "Notes" \
  --permissions 'read("any")' 'create("users")' 'update("users")' 'delete("users")'
```

### Create Attributes

```bash
# Title
appwrite databases createStringAttribute \
  --databaseId cogninote_db \
  --collectionId notes \
  --key title \
  --size 255 \
  --required true

# Content
appwrite databases createStringAttribute \
  --databaseId cogninote_db \
  --collectionId notes \
  --key content \
  --size 1000000 \
  --required true

# Type
appwrite databases createStringAttribute \
  --databaseId cogninote_db \
  --collectionId notes \
  --key type \
  --size 50 \
  --required true \
  --default document

# ... (continue for all attributes)
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Database created: `cogninote_db`
- [ ] Collection created: `notes`
- [ ] All 13 attributes added to `notes` collection
- [ ] Indexes created for performance
- [ ] Permissions set correctly
- [ ] Can create a test document manually

---

## 🎯 Environment Variables

After creating collections, update your `.env`:

```env
NEXT_PUBLIC_APPWRITE_DATABASE_ID=cogninote_db
NEXT_PUBLIC_APPWRITE_NOTES_COLLECTION_ID=notes
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_PRESENCE_COLLECTION_ID=presence
```

---

## 📚 Official Appwrite Docs

- **Database Setup**: https://appwrite.io/docs/products/databases
- **Collections**: https://appwrite.io/docs/products/databases/collections
- **Attributes**: https://appwrite.io/docs/products/databases/collections#attributes
- **Permissions**: https://appwrite.io/docs/products/databases/permissions

---

## 💡 Pro Tips

1. **Always create database first** - Collections live inside databases
2. **Use meaningful IDs** - Makes code more readable
3. **Set permissions carefully** - Controls who can access data
4. **Create indexes** - Improves query performance
5. **Test with sample data** - Verify setup before coding

---

## ✨ Summary

**The key point**: You must create a **DATABASE** first, then open it, then you'll see the **"Create Collection"** button!

**Navigation Path:**
```
Databases → + Create database → [Open database] → + Create collection
```

---

**Need more help?** Share a screenshot of what you're seeing, and I'll guide you through it! 🚀
