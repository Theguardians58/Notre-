# 🐘 Supabase (PostgreSQL) Setup Guide

**Complete guide to set up Supabase as your CogniNote backend**

---

## 🎯 What is Supabase?

Supabase is an **open-source Firebase alternative** built on PostgreSQL. It provides:

- **PostgreSQL Database** - Powerful relational database
- **Real-time subscriptions** - Live data updates
- **Authentication** - Built-in auth with multiple providers
- **Storage** - File storage with transformations
- **Row Level Security** - Database-level permissions
- **Auto-generated APIs** - REST and GraphQL

---

## ✅ Why Choose Supabase?

### **Pros:**
✅ **PostgreSQL Power** - Full SQL capabilities  
✅ **Open Source** - MIT licensed, self-hostable  
✅ **Real-time Built-in** - Native WebSocket support  
✅ **Better Queries** - Complex joins, views, functions  
✅ **Row Level Security** - Database-level permissions  
✅ **Free Tier** - 500MB database, 1GB storage  
✅ **Self-Hostable** - Docker containers  
✅ **Better Search** - Full-text search with PostgreSQL  

### **Vs Firebase:**
- More powerful queries (SQL vs NoSQL)
- Better for relational data
- Open source
- Lower costs at scale

### **Vs Appwrite:**
- More mature (since 2020)
- Better real-time support
- Stronger PostgreSQL features
- Larger community

---

## 🚀 Quick Setup (5 Minutes)

### **Step 1: Create Supabase Project**

1. Go to https://supabase.com/
2. Click **"Start your project"**
3. Sign in with GitHub
4. Click **"New project"**
5. Fill in details:
   ```
   Name: CogniNote
   Database Password: [Create strong password]
   Region: [Choose closest to users]
   Pricing Plan: Free
   ```
6. Click **"Create new project"**
7. Wait 2-3 minutes for setup

### **Step 2: Get Your Credentials**

1. Go to **Project Settings** → **API**
2. Copy these values:
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGci...
   ```

### **Step 3: Configure CogniNote**

1. Create/update `.env.local`:
   ```env
   NEXT_PUBLIC_BACKEND=supabase
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   ```

2. Restart your dev server:
   ```bash
   npm run dev
   ```

---

## 📊 Database Setup

### **Create Notes Table**

1. Go to **SQL Editor** in Supabase dashboard
2. Click **"New query"**
3. Paste this SQL:

```sql
-- Create notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  type VARCHAR(50) NOT NULL DEFAULT 'document',
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_note_id UUID REFERENCES notes(id) ON DELETE SET NULL,
  emoji VARCHAR(10) DEFAULT '📄',
  encrypted BOOLEAN DEFAULT false,
  iv TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  attachments JSONB[] DEFAULT ARRAY[]::JSONB[],
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_notes_owner_id ON notes(owner_id);
CREATE INDEX idx_notes_updated_at ON notes(updated_at DESC);
CREATE INDEX idx_notes_type ON notes(type);
CREATE INDEX idx_notes_parent ON notes(parent_note_id);
CREATE INDEX idx_notes_search ON notes USING GIN (to_tsvector('english', title || ' ' || content::text));

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notes"
  ON notes FOR SELECT
  USING (auth.uid() = owner_id OR is_public = true);

CREATE POLICY "Users can create their own notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE
  USING (auth.uid() = owner_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

4. Click **"Run"**

### **Create Users Table (Optional)**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  encryption_enabled BOOLEAN DEFAULT false,
  encryption_salt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

### **Create Presence Table (For Collaboration)**

```sql
CREATE TABLE presence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_photo TEXT,
  is_editing BOOLEAN DEFAULT false,
  last_seen TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE presence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view presence"
  ON presence FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own presence"
  ON presence FOR ALL
  USING (auth.uid() = user_id);
```

---

## 🔐 Authentication Setup

### **Enable Auth Providers**

1. Go to **Authentication** → **Providers**

2. **Email (Already enabled by default)**
   - ✅ Confirm email: Recommended
   - ✅ Secure email change: Enabled

3. **Google OAuth:**
   - Toggle **Enable**
   - Go to https://console.cloud.google.com/
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI:
     ```
     https://xxxxx.supabase.co/auth/v1/callback
     ```
   - Copy Client ID and Client Secret to Supabase

4. **GitHub OAuth:**
   - Toggle **Enable**
   - Go to https://github.com/settings/developers
   - Create OAuth App
   - Authorization callback URL:
     ```
     https://xxxxx.supabase.co/auth/v1/callback
     ```
   - Copy Client ID and Client Secret to Supabase

---

## 📦 Storage Setup

### **Create Storage Bucket**

1. Go to **Storage** in Supabase dashboard
2. Click **"New bucket"**
3. Configure:
   ```
   Name: cogninote-files
   Public bucket: Yes (or No for private files)
   File size limit: 50MB
   Allowed MIME types: Leave empty (all types)
   ```
4. Click **"Create bucket"**

### **Set Storage Policies**

1. Click on your bucket → **Policies**
2. Add policies:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'cogninote-files' AND
    auth.role() = 'authenticated'
  );

-- Allow users to view their own files
CREATE POLICY "Users can view their own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'cogninote-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'cogninote-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## ⚡ Enable Real-time

### **Turn on Realtime for Notes Table**

1. Go to **Database** → **Replication**
2. Find `notes` table
3. Toggle **Enable** for:
   - ✅ INSERT
   - ✅ UPDATE
   - ✅ DELETE

4. Do the same for `presence` table if you created it

---

## 🧪 Test Your Setup

### **1. Test Database Connection**

```sql
-- In SQL Editor, run:
SELECT * FROM notes LIMIT 1;
```

Should return empty result (no error)

### **2. Test Authentication**

1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Create a test user
4. Try logging in at http://localhost:3000/auth/login

### **3. Test Storage**

```sql
-- Check if bucket exists
SELECT * FROM storage.buckets WHERE name = 'cogninote-files';
```

---

## 🔧 Environment Variables

Your complete `.env.local` should have:

```env
# Backend Selection
NEXT_PUBLIC_BACKEND=supabase

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Service Role Key (for server-side operations)
# ⚠️ NEVER expose this in client-side code!
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🐳 Self-Hosting (Advanced)

### **Run Supabase Locally**

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase
supabase init

# Start local Supabase
supabase start
```

Your local instance will be at:
```
API URL: http://localhost:54321
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
```

Update `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=[shown in terminal]
```

### **Deploy Self-Hosted**

Follow: https://supabase.com/docs/guides/self-hosting/docker

---

## 📊 Database Schema Reference

### **Complete Notes Table Schema**

```typescript
interface NoteRow {
  id: string;                    // UUID
  title: string;                 // TEXT
  content: any;                  // JSONB
  type: string;                  // VARCHAR(50)
  owner_id: string;              // UUID
  parent_note_id: string | null; // UUID
  emoji: string;                 // VARCHAR(10)
  encrypted: boolean;            // BOOLEAN
  iv: string | null;             // TEXT
  tags: string[];                // TEXT[]
  attachments: any[];            // JSONB[]
  is_public: boolean;            // BOOLEAN
  created_at: Date;              // TIMESTAMPTZ
  updated_at: Date;              // TIMESTAMPTZ
}
```

---

## 🔍 Advanced Features

### **Full-Text Search**

```sql
-- Search notes (already indexed)
SELECT * FROM notes
WHERE to_tsvector('english', title || ' ' || content::text)
      @@ to_tsquery('english', 'search & term');
```

### **Database Functions**

```sql
-- Create custom function to get note with children
CREATE OR REPLACE FUNCTION get_note_with_children(note_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  children_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id,
    n.title,
    COUNT(c.id) as children_count
  FROM notes n
  LEFT JOIN notes c ON c.parent_note_id = n.id
  WHERE n.id = note_id
  GROUP BY n.id, n.title;
END;
$$ LANGUAGE plpgsql;
```

### **Database Triggers**

```sql
-- Auto-delete orphaned child notes
CREATE OR REPLACE FUNCTION delete_orphaned_children()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM notes WHERE parent_note_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_note_delete
  BEFORE DELETE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION delete_orphaned_children();
```

---

## 💰 Pricing

### **Free Tier:**
- ✅ 500 MB database space
- ✅ 1 GB file storage
- ✅ 2 GB bandwidth
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests

### **Pro ($25/month):**
- 8 GB database
- 100 GB storage
- 250 GB bandwidth
- 100,000 monthly active users
- Daily backups

### **Team ($599/month):**
- Dedicated resources
- Custom limits
- SOC2 compliance
- SLA

**Most users:** Free tier is enough! 🎉

---

## 🆚 Comparison with Other Backends

| Feature | Firebase | Appwrite | **Supabase** |
|---------|----------|----------|--------------|
| Database | Firestore (NoSQL) | MariaDB | **PostgreSQL** ✅ |
| Queries | Limited | Good | **Excellent (SQL)** ✅ |
| Real-time | Excellent | Good | **Excellent** ✅ |
| Open Source | ❌ No | ✅ Yes | ✅ **Yes** |
| Self-Hosting | ❌ No | ✅ Yes | ✅ **Yes (Easy)** |
| Free Tier | Good | N/A (self-host) | **Generous** ✅ |
| Learning Curve | Easy | Medium | **Medium** |
| Community | Huge | Growing | **Large & Active** ✅ |

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Can create account
- [ ] Can login
- [ ] Can create notes
- [ ] Can update notes
- [ ] Can delete notes
- [ ] Can search notes
- [ ] Can upload files
- [ ] Real-time updates work
- [ ] OAuth login works

---

## 🐛 Troubleshooting

### **Issue: "Failed to fetch"**

**Solution:**
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Ensure project is not paused (free tier)
- Check network/firewall

### **Issue: "Invalid API key"**

**Solution:**
- Use `anon` key, not `service_role` key
- Regenerate keys in Settings → API

### **Issue: "Row Level Security violation"**

**Solution:**
- Run the RLS policies SQL again
- Make sure user is authenticated
- Check `auth.uid()` matches `owner_id`

### **Issue: "Table doesn't exist"**

**Solution:**
- Run the CREATE TABLE SQL
- Check schema in Database → Tables

---

## 📚 Resources

- **Official Docs:** https://supabase.com/docs
- **JS Client:** https://supabase.com/docs/reference/javascript
- **Auth Guide:** https://supabase.com/docs/guides/auth
- **Database Guide:** https://supabase.com/docs/guides/database
- **Storage Guide:** https://supabase.com/docs/guides/storage
- **Community:** https://github.com/supabase/supabase/discussions

---

## 🎉 You're All Set!

Your CogniNote now supports **3 backend options:**

1. ✅ **Firebase** - Fast setup, Google ecosystem
2. ✅ **Appwrite** - Self-hosted, open source
3. ✅ **Supabase** - PostgreSQL power, real-time ⭐

**Switch anytime with one environment variable!**

```env
NEXT_PUBLIC_BACKEND=supabase  # or firebase or appwrite
```

---

**Ready to use Supabase with CogniNote!** 🚀

**Next Steps:**
1. Create your Supabase project
2. Run the SQL setup
3. Update .env.local
4. Start building!
