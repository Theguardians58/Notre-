# 🚀 Appwrite Backend Setup Guide

**Alternative Backend**: Use Appwrite instead of Firebase!

---

## 🎯 Why Appwrite?

### Benefits
✅ **Open Source** - Full transparency and control  
✅ **Self-Hostable** - Deploy on your own infrastructure  
✅ **Free Tier** - Generous limits on Cloud  
✅ **Privacy-Focused** - Your data, your rules  
✅ **Easy to Use** - Simple API and dashboard  
✅ **Real-time** - Built-in WebSocket support  
✅ **No Vendor Lock-in** - Switch backends anytime  

### Comparison

| Feature | Firebase | Appwrite |
|---------|----------|----------|
| **Open Source** | ❌ Proprietary | ✅ MIT License |
| **Self-Hosting** | ❌ No | ✅ Yes (Docker) |
| **Free Tier** | ✅ Generous | ✅ Very Generous |
| **Real-time** | ✅ Firestore | ✅ WebSocket |
| **Authentication** | ✅ Excellent | ✅ Excellent |
| **Storage** | ✅ Yes | ✅ Yes |
| **Pricing** | Pay per use | Free Cloud / Self-host |

---

## 🔧 Setup Methods

### Option 1: Appwrite Cloud (Easiest) ⭐

**Time**: 5 minutes  
**Cost**: FREE

#### Step 1: Create Appwrite Account

1. Go to: https://cloud.appwrite.io
2. Click "Sign Up" (or "Get Started")
3. Create account (email or GitHub)
4. Verify email

#### Step 2: Create Project

1. Click "Create Project"
2. Name: "CogniNote"
3. Project ID: (auto-generated)
4. Region: Choose closest to you
5. Click "Create"

#### Step 3: Create Database

1. Go to **Databases** in sidebar
2. Click "Create Database"
3. Database ID: `cogninote_db`
4. Name: "CogniNote Database"
5. Click "Create"

#### Step 4: Create Collections

**A. Notes Collection:**

1. Click "Create Collection"
2. Collection ID: `notes`
3. Name: "Notes"
4. Click "Create"

5. Add Attributes (click "Create Attribute"):
   ```
   - title (String, 255, required)
   - content (String, 1000000, required) // Large for JSON
   - type (String, 50, required, default: 'document')
   - ownerId (String, 100, required)
   - parentNoteId (String, 100, optional)
   - emoji (String, 10, optional, default: '📄')
   - encrypted (Boolean, default: false)
   - iv (String, 500, optional)
   - tags (String[], optional)
   - attachments (String, 10000, optional) // JSON array
   - createdAt (DateTime, required)
   - updatedAt (DateTime, required)
   ```

6. Set Permissions:
   - Click "Settings" tab
   - Permissions:
     - Read: `user:{userId}`
     - Create: `user:{userId}`
     - Update: `user:{userId}`
     - Delete: `user:{userId}`

7. Create Indexes (for performance):
   - Click "Indexes" tab
   - Add indexes:
     - `ownerId` (ASC)
     - `updatedAt` (DESC)
     - `type` (ASC)
     - `parentNoteId` (ASC)

**B. Users Collection** (optional, for extended user data):

1. Collection ID: `users`
2. Name: "Users"
3. Attributes:
   ```
   - userId (String, 100, required)
   - displayName (String, 255)
   - settings (String, 10000) // JSON
   - createdAt (DateTime)
   ```

**C. Presence Collection** (for collaboration):

1. Collection ID: `presence`
2. Name: "Presence"
3. Attributes:
   ```
   - userId (String, 100, required)
   - noteId (String, 100, required)
   - userName (String, 255)
   - userPhoto (String, 500)
   - isEditing (Boolean, default: false)
   - lastSeen (DateTime)
   ```

#### Step 5: Create Storage Bucket

1. Go to **Storage** in sidebar
2. Click "Create Bucket"
3. Bucket ID: `cogninote_storage`
4. Name: "CogniNote Storage"
5. Max File Size: `50MB` (or your preference)
6. Allowed File Extensions: Leave empty (all)
7. Compression: `gzip` (optional)
8. Encryption: Enable
9. Antivirus: Enable (optional)

10. Set Permissions:
    - Read: `user:{userId}`
    - Create: `user:{userId}`
    - Update: `user:{userId}`
    - Delete: `user:{userId}`

#### Step 6: Enable Authentication

1. Go to **Auth** in sidebar
2. Enable methods:
   - ✅ **Email/Password**
   - ✅ **Google OAuth** (optional)
   - ✅ **GitHub OAuth** (optional)

3. For OAuth providers:
   - Click provider
   - Add OAuth credentials
   - Set redirect URLs:
     - Success: `https://your-domain.com/dashboard`
     - Failure: `https://your-domain.com/auth/login`

#### Step 7: Get API Keys

1. Go to **Settings** → **API Keys**
2. Your keys are shown:
   - **Project ID**: (copy this)
   - **API Endpoint**: `https://cloud.appwrite.io/v1`

3. These go in your `.env.local`:
   ```env
   NEXT_PUBLIC_BACKEND=appwrite
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=cogninote_db
   NEXT_PUBLIC_APPWRITE_NOTES_COLLECTION_ID=notes
   NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
   NEXT_PUBLIC_APPWRITE_PRESENCE_COLLECTION_ID=presence
   NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=cogninote_storage
   ```

---

### Option 2: Self-Hosted Appwrite (Advanced)

**Time**: 15 minutes  
**Cost**: FREE (your server)

#### Requirements
- Docker & Docker Compose
- Server with 2GB+ RAM
- Domain (optional, for HTTPS)

#### Quick Setup

```bash
# 1. Install Docker (if not installed)
curl -fsSL https://get.docker.com | sh

# 2. Install Appwrite
docker run -it --rm \
    --volume /var/run/docker.sock:/var/run/docker.sock \
    --volume "$(pwd)"/appwrite:/usr/src/code/appwrite:rw \
    --entrypoint="install" \
    appwrite/appwrite:1.5.7

# 3. Follow prompts:
# - HTTP Port: 80
# - HTTPS Port: 443
# - Domain: your-domain.com (or localhost)
# - Email: your@email.com

# 4. Start Appwrite
cd appwrite
docker compose up -d

# 5. Access dashboard
# http://localhost or https://your-domain.com
```

#### Post-Installation

1. Access dashboard at your domain
2. Create admin account
3. Follow Steps 2-7 from Cloud setup above
4. Use your endpoint:
   ```env
   NEXT_PUBLIC_APPWRITE_ENDPOINT=http://localhost/v1
   # or
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://your-domain.com/v1
   ```

---

## 🔧 Environment Configuration

### Create `.env.local`

Copy `.env.example` and update:

```env
# Switch to Appwrite
NEXT_PUBLIC_BACKEND=appwrite

# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id

# Database & Collections
NEXT_PUBLIC_APPWRITE_DATABASE_ID=cogninote_db
NEXT_PUBLIC_APPWRITE_NOTES_COLLECTION_ID=notes
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_PRESENCE_COLLECTION_ID=presence

# Storage
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=cogninote_storage
```

### Switching Between Backends

Just change one line in `.env.local`:

**Use Firebase:**
```env
NEXT_PUBLIC_BACKEND=firebase
```

**Use Appwrite:**
```env
NEXT_PUBLIC_BACKEND=appwrite
```

Your app automatically adapts! No code changes needed.

---

## 🧪 Test Your Setup

### 1. Test Connection

```bash
npm run dev
# Open http://localhost:3000
```

### 2. Test Authentication

1. Go to login page
2. Sign up with email
3. Check Appwrite dashboard → Auth
4. User should appear!

### 3. Test Database

1. Create a note
2. Check Appwrite dashboard → Databases → Notes
3. Note should appear!

### 4. Test Storage

1. Upload an image
2. Check Appwrite dashboard → Storage
3. File should appear!

---

## 📊 Features Support

| Feature | Firebase | Appwrite |
|---------|----------|----------|
| Authentication | ✅ | ✅ |
| Database (CRUD) | ✅ | ✅ |
| Real-time Updates | ✅ | ✅ |
| File Storage | ✅ | ✅ |
| Search | ✅ | ✅ |
| File Previews | ✅ | ✅ |
| OAuth | ✅ | ✅ |

**All CogniNote features work with both backends!**

---

## 🔄 Migration Guide

### From Firebase to Appwrite

#### Option 1: Fresh Start
1. Set up Appwrite (above)
2. Change `.env.local` to Appwrite
3. Users re-create notes

#### Option 2: Data Migration (Manual)

```typescript
// scripts/migrate-firebase-to-appwrite.ts

import { getBackendAdapter } from '@/lib/backend-adapter';

async function migrate() {
  // 1. Export from Firebase
  const firebaseAdapter = await getBackendAdapter('firebase');
  const notes = await firebaseAdapter.database.getNotes(userId);
  
  // 2. Import to Appwrite
  const appwriteAdapter = await getBackendAdapter('appwrite');
  for (const note of notes) {
    await appwriteAdapter.database.createNote(userId, note);
  }
}
```

#### Option 3: Dual Backend (Advanced)
- Run both backends simultaneously
- Gradual migration
- Fallback capability

---

## 💰 Pricing

### Appwrite Cloud (Free Tier)

✅ **750,000 Executions/month**  
✅ **1 Database** (unlimited collections)  
✅ **2GB Storage**  
✅ **Unlimited Bandwidth**  
✅ **Unlimited Users**  
✅ **Real-time Updates**  
✅ **SSL Certificates**  

**Pro Plan**: $15/month
- More executions
- More storage
- Priority support

### Self-Hosted

**FREE** - Just your server costs:
- VPS: $5-10/month
- Or on-premise (free)
- Unlimited everything!

---

## 🔒 Security

### Appwrite Security Features

✅ **Encrypted at Rest**  
✅ **Encrypted in Transit** (HTTPS)  
✅ **GDPR Compliant**  
✅ **SOC 2 Type II** (Cloud)  
✅ **Role-Based Access**  
✅ **API Key Management**  
✅ **Rate Limiting**  
✅ **IP Whitelisting**  

### Best Practices

1. **Never expose secrets**:
   - Use environment variables
   - Don't commit `.env.local`

2. **Set proper permissions**:
   - User-specific read/write
   - No public access to private notes

3. **Use HTTPS**:
   - Cloud: automatic
   - Self-hosted: use Let's Encrypt

4. **Enable 2FA**:
   - Appwrite Cloud account
   - Admin accounts

---

## 🐛 Troubleshooting

### Issue: "Project not found"

**Solution:**
- Check `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
- Verify project exists in dashboard
- Correct endpoint URL

### Issue: "Collection not found"

**Solution:**
- Create collection in dashboard
- Match collection ID exactly
- Check database ID

### Issue: "Permission denied"

**Solution:**
- Set collection permissions
- User must be authenticated
- Check `user:{userId}` permission

### Issue: "File upload fails"

**Solution:**
- Check bucket exists
- Set bucket permissions
- Verify file size limits

### Issue: "CORS error"

**Solution:**
- Add your domain to Appwrite
- Settings → Platforms → Add Web
- Add: `http://localhost:3000`

---

## 📚 Resources

### Documentation
- Official Docs: https://appwrite.io/docs
- API Reference: https://appwrite.io/docs/references
- Community: https://appwrite.io/community

### Tutorials
- Quick Start: https://appwrite.io/docs/quick-starts/nextjs
- Authentication: https://appwrite.io/docs/products/auth
- Database: https://appwrite.io/docs/products/databases
- Storage: https://appwrite.io/docs/products/storage

### Support
- Discord: https://appwrite.io/discord
- GitHub: https://github.com/appwrite/appwrite
- Forum: https://github.com/appwrite/appwrite/discussions

---

## ✅ Checklist

Setup complete when you can:

- [ ] Access Appwrite dashboard
- [ ] Project created
- [ ] Database created
- [ ] Collections created with attributes
- [ ] Storage bucket created
- [ ] Authentication enabled
- [ ] Environment variables set
- [ ] App connects successfully
- [ ] Can sign up/login
- [ ] Can create notes
- [ ] Can upload files
- [ ] Real-time updates work

---

## 🎯 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your Appwrite credentials

# 3. Set backend to Appwrite
# In .env.local:
NEXT_PUBLIC_BACKEND=appwrite

# 4. Start app
npm run dev

# 5. Test at http://localhost:3000
```

---

## 🚀 Deploy with Appwrite

### Vercel

1. Deploy to Vercel (as before)
2. Add environment variables:
   - `NEXT_PUBLIC_BACKEND=appwrite`
   - All Appwrite variables
3. Redeploy

### Netlify

Same as Vercel - just add env vars

### Docker (Self-Hosted Both)

```dockerfile
# Run both CogniNote and Appwrite
docker-compose up -d
```

---

## 🎉 Benefits Summary

### Why Choose Appwrite?

1. **Open Source** - Full control and transparency
2. **Self-Hostable** - Your data, your server
3. **Free Forever** - Generous free tier or self-host
4. **Easy Setup** - 5 minute configuration
5. **No Vendor Lock-in** - Switch anytime
6. **Privacy First** - GDPR compliant
7. **Great DX** - Excellent developer experience
8. **Active Community** - 40k+ GitHub stars

### Use Cases

**Choose Appwrite if:**
- You want open source
- You need self-hosting
- You prioritize privacy
- You want predictable costs
- You need European hosting

**Choose Firebase if:**
- You want Google ecosystem
- You need specific Firebase features
- You prefer managed service
- You have Firebase expertise

**Both work perfectly with CogniNote!**

---

## 📞 Need Help?

- **Documentation**: See above resources
- **Issues**: GitHub Issues
- **Discord**: Appwrite community
- **Email**: support@appwrite.io

---

**Your CogniNote now supports both Firebase and Appwrite!** 🎉

Switch backends anytime with just one environment variable change.
