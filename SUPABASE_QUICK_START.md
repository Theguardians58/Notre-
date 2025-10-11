# 🚀 Supabase Quick Start - 5 Minutes

**Supabase is now the default and recommended database for CogniNote!**

Get your app running with Supabase in 5 minutes.

---

## ⚡ Why Supabase is Default

✅ **PostgreSQL** - Industry-standard relational database  
✅ **Generous Free Tier** - 500MB database + 1GB storage  
✅ **Row Level Security** - Database-enforced permissions  
✅ **Real-time** - WebSocket-based live updates  
✅ **Self-Hostable** - Full control over your data  
✅ **Modern Tools** - Great dashboard and CLI  

---

## 🎯 Quick Setup (5 Minutes)

### Step 1: Create Supabase Project (2 min)

1. **Go to:** https://supabase.com/
2. Click **"Start your project"** (free - no credit card!)
3. Sign in with GitHub
4. Click **"New project"**
5. Fill in:
   - **Name:** `cogninote` (or your choice)
   - **Database Password:** Create a strong password
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free
6. Click **"Create new project"**
7. Wait 1-2 minutes for setup

### Step 2: Get Your API Keys (1 min)

1. In your project, go to **Settings** (⚙️) → **API**
2. Copy two values:
   - **Project URL** (looks like: `https://xxx.supabase.co`)
   - **anon public** key (the long string under "Project API keys")

### Step 3: Set Up Database (1 min)

1. In Supabase dashboard, click **SQL Editor** (left menu)
2. Click **"New query"**
3. Copy and paste this SQL:

```sql
-- Create notes table
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

-- Create index for better performance
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_parent_note_id ON notes(parent_note_id);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notes;
```

4. Click **"Run"** (or press Ctrl+Enter)
5. Should see "Success" message

### Step 4: Enable Authentication (30 sec)

1. Go to **Authentication** → **Providers** (left menu)
2. **Email** is already enabled ✅
3. Optional: Enable **Google** or **GitHub** if you want

### Step 5: Enable Storage (30 sec)

1. Go to **Storage** (left menu)
2. Click **"Create a new bucket"**
3. Name it: `cogninote-files`
4. Make it **Public** (toggle on)
5. Click **"Create bucket"**

### Step 6: Add to Your App (1 min)

**For Local Development:**

Create `.env.local` file:

```env
NEXT_PUBLIC_BACKEND=supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**For Netlify/Vercel:**

Add environment variables:

1. **Netlify:** Site settings → Environment variables
2. **Vercel:** Project settings → Environment Variables

Add:
```
NEXT_PUBLIC_BACKEND=supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 7: Run Your App

```bash
npm run dev
```

Visit: http://localhost:3000

✅ **You're done!**

---

## 🎬 What You Get

With Supabase, you now have:

✅ **PostgreSQL Database** - Full SQL support  
✅ **Authentication** - Email/password, social logins  
✅ **Storage** - 1GB free file storage  
✅ **Real-time** - Live updates across devices  
✅ **Row Level Security** - Secure by default  
✅ **Dashboard** - Great UI for managing data  

---

## 📊 Supabase Free Tier

What you get for **free forever**:

- 💾 **500 MB database space**
- 📁 **1 GB file storage**
- 🚀 **2 GB bandwidth/month**
- 👥 **50,000 monthly active users**
- 🔐 **50 GB data transfer**
- 🌐 **Unlimited API requests**

**Perfect for getting started and testing!**

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Supabase project created
- [ ] Database tables created (SQL ran successfully)
- [ ] Storage bucket created
- [ ] Environment variables added
- [ ] App starts without errors
- [ ] Can sign up for an account
- [ ] Can log in
- [ ] Can create a note
- [ ] Can edit a note
- [ ] Can delete a note

---

## 🔧 Troubleshooting

### Issue: "Invalid API key"

**Fix:**
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the **anon public** key (not the service_role key!)
- No quotes around values in .env file

### Issue: "Row Level Security" errors

**Fix:**
- Make sure you ran ALL the SQL from Step 3
- Check policies were created: Go to Authentication → Policies
- Make sure user is logged in

### Issue: Can't create notes

**Fix:**
- Check SQL policies were created
- Verify user is authenticated
- Check browser console for specific error

### Issue: Tables not found

**Fix:**
- Run the SQL from Step 3 again
- Check in Table Editor that `notes` table exists

---

## 🚀 Next Steps

Now that Supabase is set up:

1. **Deploy:** Push to Netlify/Vercel with env vars
2. **Explore:** Check out the Supabase dashboard
3. **Customize:** Modify tables/policies for your needs
4. **Scale:** Upgrade when you need more resources

---

## 📚 Additional Resources

**Supabase Documentation:**
- Main docs: https://supabase.com/docs
- JavaScript client: https://supabase.com/docs/reference/javascript
- Auth guide: https://supabase.com/docs/guides/auth
- Storage guide: https://supabase.com/docs/guides/storage

**CogniNote Documentation:**
- Complete Supabase guide: `SUPABASE_SETUP.md`
- Backend comparison: `BACKEND_COMPARISON.md`
- Switching backends: `README.md`

---

## 💡 Why Supabase is Better for Most Users

| Feature | Supabase | Firebase | Appwrite |
|---------|----------|----------|----------|
| Database Type | PostgreSQL ✅ | NoSQL | MariaDB |
| SQL Support | Full ✅ | None | Limited |
| Free Tier | 500MB ✅ | Good | Self-host |
| Learning Curve | Easy ✅ | Easy | Medium |
| Self-Hosting | Yes ✅ | No | Yes |
| Row Level Security | Built-in ✅ | Manual | Manual |
| Real-time | WebSocket ✅ | Good | Limited |
| Dashboard | Excellent ✅ | Good | Good |

**Supabase gives you enterprise features with a generous free tier!**

---

## 🎉 You're All Set!

Your CogniNote is now running on Supabase!

- ✅ PostgreSQL database
- ✅ Secure authentication  
- ✅ File storage
- ✅ Real-time updates
- ✅ Row Level Security

**Enjoy building!** 🚀

---

**Questions?** Check `SUPABASE_SETUP.md` for more details or visit the Supabase Discord.

**Last Updated:** October 2025  
**Default Backend:** Supabase PostgreSQL ✅
