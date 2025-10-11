# 🚨 URGENT: Fix Firebase Error in 5 Minutes

**Error:** `Firebase: Error (auth/invalid-api-key)`

**Cause:** Your Netlify has NO environment variables set!

**Fix:** Add 3 Supabase variables to Netlify (easiest option)

**Time:** 5-7 minutes

---

## ⚡ QUICK FIX (Do This Now!)

### Step 1: Create Supabase Project (2 minutes)

1. **Open:** https://supabase.com in a new tab
2. **Click:** "Start your project" button
3. **Sign in** with GitHub (free!)
4. **Click:** "New project"
5. **Fill in:**
   - Organization: Select or create
   - Name: `cogninote`
   - Database Password: Create a strong password (save it!)
   - Region: Choose closest to you
6. **Click:** "Create new project"
7. **Wait:** 2 minutes while it sets up

### Step 2: Run SQL Setup (1 minute)

**While waiting for Step 1, prepare this SQL:**

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled',
  content JSONB DEFAULT '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb,
  type TEXT DEFAULT 'document',
  parent_note_id UUID REFERENCES notes(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_parent_note_id ON notes(parent_note_id);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notes"
  ON notes FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes"
  ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE notes;
```

**Once project is ready:**
1. Go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Paste the SQL above
4. Click **"Run"** (or Ctrl+Enter)
5. Should see: "Success. No rows returned"

### Step 3: Get API Keys (30 seconds)

1. In Supabase, go to **Settings** (⚙️ icon) → **API**
2. You'll see two important values:

**Project URL:**
```
https://abcdefghijklmnop.supabase.co
```
Copy this! ↑

**anon public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```
Copy this! ↑ (it's a very long string)

### Step 4: Add to Netlify (1 minute)

**IMPORTANT:** This is the step that fixes the error!

1. **Open:** https://app.netlify.com
2. **Go to:** Your site (fancy-pothos-3c2eb5 or your site name)
3. **Click:** Site configuration → Environment variables
   - OR go directly to: Site settings → Environment variables
4. **Click:** "Add a variable" button

**Add these 3 variables:**

#### Variable 1:
- Key: `NEXT_PUBLIC_BACKEND`
- Value: `supabase`
- Scopes: Same for all deploy contexts
- Click "Create variable"

#### Variable 2:
- Key: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://your-project.supabase.co` (paste from Step 3)
- Scopes: Same for all deploy contexts
- Click "Create variable"

#### Variable 3:
- Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `eyJhbG...` (paste the long key from Step 3)
- Scopes: Same for all deploy contexts
- Click "Create variable"

**CRITICAL:** Make sure you added ALL 3 variables!

### Step 5: Redeploy (2 minutes)

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** button
3. Select **"Deploy site"**
4. **Wait** 2-3 minutes for build to complete
5. ✅ **Done!**

---

## ✅ Verify It's Fixed

After the deploy completes:

1. **Visit your site**
2. Should redirect to `/auth/login` (no error!)
3. **Try signing up** - should work
4. **Check `/debug` page** - should show all green ✅

---

## 🚨 Still Seeing Error?

### Did you redeploy?

**Adding variables is NOT enough!**

You MUST click "Trigger deploy" after adding variables.

### Check all 3 variables are there:

1. Go to Site settings → Environment variables
2. Should see:
   - ✅ NEXT_PUBLIC_BACKEND
   - ✅ NEXT_PUBLIC_SUPABASE_URL
   - ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY

### Check values are correct:

- No quotes around values
- No extra spaces
- Complete keys copied
- Correct project URL

### Check deploy finished:

- Go to Deploys tab
- Latest deploy should say "Published"
- Build log should show "✓ Compiled successfully"

---

## 📊 Why This Fixes The Error

**Before:**
```
Netlify: No env vars ❌
   ↓
App: "I don't know which backend to use"
   ↓
App: "Let me try Firebase..."
   ↓
Firebase: Error (no API key) ❌
```

**After:**
```
Netlify: NEXT_PUBLIC_BACKEND=supabase ✅
   ↓
App: "Use Supabase!"
   ↓
Supabase: Connects successfully ✅
   ↓
Your app works! 🎉
```

---

## 💡 Why Supabase is Better

**Supabase:**
- 3 environment variables
- 5 minutes setup
- 500MB database FREE
- PostgreSQL (SQL)
- Row Level Security built-in

**Firebase:**
- 7 environment variables
- 10+ minutes setup
- Limited free tier
- Firestore (NoSQL)
- Manual security rules

**Supabase = Easier!** ✅

---

## 🎯 Checklist

Before closing this guide, make sure:

- [ ] Created Supabase project
- [ ] Ran SQL setup (tables created)
- [ ] Got Project URL and anon key
- [ ] Added ALL 3 variables to Netlify
- [ ] Clicked "Trigger deploy"
- [ ] Waited for deploy to finish
- [ ] Tested the site (no Firebase error)
- [ ] Can sign up and log in
- [ ] Can create notes

---

## 📞 Need Help?

**If still not working:**

1. **Check `/debug` page** - shows exact problem
2. **Check browser console** - F12 → Console tab
3. **Check Netlify build log** - Deploys → Latest deploy
4. **Verify all 3 variables** - Site settings → Env vars

**Common mistakes:**
- Forgot to redeploy after adding variables
- Typo in variable names
- Missing one of the 3 variables
- Extra quotes around values

---

## 🎉 That's It!

Once you add those 3 variables and redeploy:

✅ Firebase error will be GONE  
✅ App will connect to Supabase  
✅ Everything will work  

**The error happens because Netlify doesn't have backend configuration yet. Adding these 3 variables tells it to use Supabase!**

---

**Total Time:** 5-7 minutes  
**Difficulty:** Easy  
**Result:** Working app with Supabase! 🚀

---

**Last Updated:** October 2025  
**For:** CogniNote Netlify Deployment  
**Default Backend:** Supabase (recommended)
