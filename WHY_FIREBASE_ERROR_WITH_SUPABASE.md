# 🔍 Why Am I Getting Firebase Errors After Switching to Supabase?

**Short Answer:** Your Netlify deployment doesn't know you switched to Supabase yet!

---

## 🎯 The Problem

You're seeing Firebase errors like:
```
Firebase: Error (auth/invalid-api-key)
```

Even though we changed the default to Supabase in the code.

**Why?**

The code change only affects **new deployments**. Your current Netlify deployment still has:
- No environment variables set, OR
- Old Firebase variables from before

When the app starts, it doesn't know which backend to use, so it tries Firebase (the old default).

---

## ✅ The Solution (2 Minutes)

Tell Netlify to use Supabase by adding environment variables!

### Quick Fix:

**1. Visit Debug Page**

https://your-site.netlify.app/debug

This will show you exactly what's missing.

**2. Add Supabase Environment Variables**

Go to: https://app.netlify.com/sites/fancy-pothos-3c2eb5/settings/env

Add these **3 variables**:

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `NEXT_PUBLIC_BACKEND` | `supabase` | Just type it |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...` | Supabase Dashboard → Settings → API |

**3. Create Supabase Project (if you haven't)**

If you don't have a Supabase project yet:

1. Go to: https://supabase.com
2. Click "Start your project" (free!)
3. Create new project
4. Wait 2 minutes for setup
5. Get URL and key from Settings → API

**4. Redeploy**

1. Go to Netlify Deploys tab
2. Click "Trigger deploy"
3. Wait 2-3 minutes
4. ✅ Firebase errors will be gone!

---

## 🤔 Why This Happens

### How Environment Variables Work:

```
Code (GitHub)          Netlify Build          Live Site
    ↓                       ↓                     ↓
Default: supabase    +  Env Vars = ?    →  What backend?
```

**Without env vars:**
- App doesn't know which backend to use
- Falls back to trying Firebase
- Gets errors because Firebase not configured

**With env vars:**
- `NEXT_PUBLIC_BACKEND=supabase` → Use Supabase!
- Loads Supabase URL and key
- Works perfectly ✅

---

## 📋 Step-by-Step Fix

### Option 1: Use Supabase (Recommended - Easier!)

**Time:** 5-7 minutes total

**Step 1: Create Supabase Project (2 min)**
```
1. Visit https://supabase.com
2. Sign up with GitHub (free!)
3. Click "New project"
4. Name: cogninote
5. Create database password
6. Choose region
7. Click "Create"
8. Wait 2 minutes
```

**Step 2: Run SQL Setup (1 min)**
```
1. Go to SQL Editor
2. Click "New query"
3. Copy SQL from SUPABASE_QUICK_START.md
4. Click "Run"
5. Done!
```

**Step 3: Get API Keys (30 sec)**
```
1. Settings → API
2. Copy "Project URL"
3. Copy "anon public" key
```

**Step 4: Add to Netlify (1 min)**
```
1. Netlify: Site settings → Environment variables
2. Add NEXT_PUBLIC_BACKEND=supabase
3. Add NEXT_PUBLIC_SUPABASE_URL=your_url
4. Add NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
5. Save
```

**Step 5: Redeploy (2 min)**
```
1. Deploys tab
2. "Trigger deploy"
3. Wait for completion
4. Visit /debug to verify
5. ✅ All green!
```

---

### Option 2: Use Firebase (If You Prefer)

If you want to stick with Firebase:

**Step 1: Get Firebase Config**
```
1. https://console.firebase.google.com/
2. Your project → Settings
3. Copy all 6 config values
```

**Step 2: Add to Netlify**
```
Add these 7 variables:
- NEXT_PUBLIC_BACKEND=firebase
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
```

**Step 3: Redeploy**

---

## 🔍 How to Check What's Wrong

### Use the Debug Page

Visit: `https://your-site.netlify.app/debug`

This shows:
- ✅ Which variables are set (green)
- ❌ Which are missing (red)
- 🔍 Current backend selection
- 📋 Exact fix instructions

### Check Browser Console

1. Open your site
2. Press F12 → Console
3. Look for:
```
❌ Missing Firebase environment variables
```

This means: No backend is configured!

---

## 💡 Why Supabase is Easier

**Supabase: 3 variables**
```env
NEXT_PUBLIC_BACKEND=supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

**Firebase: 7 variables**
```env
NEXT_PUBLIC_BACKEND=firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

**Supabase = Simpler!** ✅

---

## 🎯 Quick Reference

### Current State:
```
Code:     Default = Supabase ✅
Netlify:  No variables set ❌
Result:   Firebase errors ❌
```

### After Fix:
```
Code:     Default = Supabase ✅
Netlify:  Supabase variables ✅
Result:   Works perfectly! ✅
```

---

## ✅ Verification Checklist

After adding variables and redeploying:

- [ ] Visit /debug page
- [ ] See "✅ Configuration OK"
- [ ] All variables show green checkmarks
- [ ] Homepage redirects to /auth/login
- [ ] Can create account
- [ ] Can log in
- [ ] Can create notes
- [ ] No Firebase errors in console

---

## 🆘 Still Getting Errors?

### Check 1: Did You Redeploy?

**Environment variable changes require a redeploy!**

1. Add variables ✅
2. Save ✅
3. **Trigger deploy** ⚠️ ← Don't forget!

### Check 2: Correct Values?

- No typos in variable names
- No quotes around values
- No extra spaces
- Copied complete keys

### Check 3: Right Backend?

```env
# Make sure it says:
NEXT_PUBLIC_BACKEND=supabase

# Not:
NEXT_PUBLIC_BACKEND=firebase  ← Wrong!
```

### Check 4: Visit Debug Page

Always check `/debug` after deploying to see current status!

---

## 📚 Additional Help

**Guides:**
- `SUPABASE_QUICK_START.md` - 5-minute Supabase setup
- `SUPABASE_SETUP.md` - Complete Supabase guide
- `FIX_FIREBASE_API_KEY_ERROR.md` - Firebase errors
- `CHECK_DEPLOYMENT_ERROR.md` - General debugging

**Debug Tools:**
- `/debug` page - Live configuration checker
- Browser console - Detailed error messages
- Netlify build log - Build-time issues

---

## 🎉 Summary

**Problem:** Firebase errors even though code uses Supabase  
**Cause:** Netlify doesn't have Supabase environment variables  
**Solution:** Add 3 Supabase variables to Netlify and redeploy  
**Time:** 5-7 minutes  

**Steps:**
1. Create Supabase project (or use existing)
2. Add 3 env vars to Netlify
3. Redeploy
4. ✅ Done!

**The Firebase error will disappear once Netlify knows to use Supabase!**

---

**Last Updated:** October 2025  
**Default Backend:** Supabase (3 variables)  
**Debug Page:** /debug
