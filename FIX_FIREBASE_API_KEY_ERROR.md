# 🔥 Fix: Firebase Invalid API Key Error

**Error:** `Firebase: Error (auth/invalid-api-key)`

This error means the Firebase API key is either missing, incorrect, or formatted wrong.

---

## ⚡ QUICK FIX (2 Minutes)

### Option 1: Fix in Netlify

1. **Go to Netlify Environment Variables:**
   - https://app.netlify.com/sites/fancy-pothos-3c2eb5/settings/env

2. **Check `NEXT_PUBLIC_FIREBASE_API_KEY`:**
   - Does it exist? ✅
   - Is it correct? (Should be ~39 characters starting with `AIza`)
   - Any spaces or quotes? ❌ Remove them!

3. **Get the Correct API Key:**
   ```
   Go to: https://console.firebase.google.com/
   1. Select your project
   2. Click ⚙️ Settings → Project settings
   3. Scroll to "Your apps" → Select/Add Web app
   4. Copy the apiKey value (NOT the whole config object!)
   ```

4. **Update the Variable:**
   - Click on `NEXT_PUBLIC_FIREBASE_API_KEY`
   - Replace with correct value
   - Save
   - **Important:** Trigger a new deploy!

5. **Redeploy:**
   - Go to Deploys tab
   - Click "Trigger deploy" → "Clear cache and deploy site"
   - Wait 2-3 minutes
   - ✅ Should work!

### Option 2: Fix in Vercel (Easier!)

If using Vercel:

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Find `NEXT_PUBLIC_FIREBASE_API_KEY`
5. Update the value
6. Redeploy

---

## 🔍 Common Mistakes

### ❌ Mistake 1: Wrong Value Format

**Wrong:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyC..."
```

**Right:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
```
(No quotes in Netlify/Vercel!)

### ❌ Mistake 2: Copying Entire Config

**Wrong:** Copying this entire object
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "...",
  ...
};
```

**Right:** Copy ONLY the value
```
AIzaSyC...
```

### ❌ Mistake 3: Typo in Variable Name

**Wrong:**
- `NEXT_PUBLIC_FIREBASE_APIKEY` (no underscore)
- `FIREBASE_API_KEY` (missing NEXT_PUBLIC_)
- `NEXT_PUBLIC_FIREBASE_KEY` (wrong name)

**Right:**
```
NEXT_PUBLIC_FIREBASE_API_KEY
```

### ❌ Mistake 4: Using Development Key in Production

Make sure you're using the correct Firebase project:
- Development: One project
- Production: Another project (or same, but check!)

### ❌ Mistake 5: Forgot to Redeploy

**After changing environment variables, you MUST redeploy!**

---

## 📋 Step-by-Step Verification

### Step 1: Check Firebase Console

1. Go to: https://console.firebase.google.com/
2. Select your project (or create one if you don't have it)
3. Click ⚙️ **Settings** → **Project settings**
4. Scroll to **"Your apps"** section

**Don't see a web app?**
- Click **Add app** → Select Web (`</>` icon)
- Give it a name (e.g., "CogniNote Web")
- Click **Register app**

5. You'll see the config. Copy the `apiKey` value:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC-YourActualKeyHere123456789",  // ← Copy THIS value only
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### Step 2: Update Netlify

1. Go to: https://app.netlify.com/sites/fancy-pothos-3c2eb5/settings/env

2. Click **"Add a variable"** or edit existing:
   - Key: `NEXT_PUBLIC_FIREBASE_API_KEY`
   - Value: `AIzaSyC-YourActualKeyHere123456789` (paste the value)
   - Scope: All (or specific branch)
   - Click **Save**

3. **Important:** Also add all other Firebase variables:

```env
NEXT_PUBLIC_BACKEND=firebase

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC-YourActualKeyHere123456789
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### Step 3: Trigger Redeploy

1. Go to **Deploys** tab
2. Click **"Trigger deploy"**
3. Select **"Clear cache and deploy site"**
4. Wait for build to complete (2-3 minutes)
5. Check the site again

### Step 4: Verify in Browser

1. Open your deployed site
2. Press **F12** → **Console** tab
3. Look for messages:
   - ✅ "Firebase configuration validated"
   - ❌ "Missing Firebase environment variables"

---

## 🐛 Still Getting the Error?

### Check 1: Environment Variables Are Set

In Netlify deploy log, look for:
```
Environment variables from UI:
  NEXT_PUBLIC_BACKEND: [secure]
  NEXT_PUBLIC_FIREBASE_API_KEY: [secure]
  ...
```

If you don't see your variables listed, they're not set!

### Check 2: Correct Scoping

Make sure environment variables are scoped to:
- ✅ **All deploys** (recommended)
- Or: **Production deploys only**

Not just **Branch deploys**!

### Check 3: Firebase Project Exists

1. Go to Firebase Console
2. Make sure the project actually exists
3. Make sure you're using the right Google account

### Check 4: API Key Not Restricted

1. In Firebase Console → Project settings
2. Check if API key has restrictions
3. For web apps, it should work with any domain
4. But double-check in Firebase Console → APIs & Services (Google Cloud)

### Check 5: Build Log

Check Netlify build log for errors:
1. Go to Deploys → Latest deploy
2. Click on the deploy
3. Check for errors in build log

---

## 🔄 Alternative: Create New Firebase Project

If nothing works, create a fresh Firebase project:

### Quick Setup

```bash
# 1. Go to Firebase Console
https://console.firebase.google.com/

# 2. Click "Add Project"
# 3. Name it (e.g., "CogniNote-Production")
# 4. Follow wizard (disable Analytics if you want)

# 5. Add Web App
# Click </> icon
# Name it: "CogniNote Web"
# Register app

# 6. Copy ALL config values to Netlify

# 7. Enable services:
#    - Authentication → Email/Password
#    - Firestore Database → Create database
#    - Storage → Get started

# 8. Redeploy Netlify
```

---

## ✅ Verification Checklist

- [ ] Firebase project exists and is active
- [ ] Web app is registered in Firebase
- [ ] API key copied correctly (39 chars, starts with AIza)
- [ ] All 7 Firebase variables added to Netlify:
  - [ ] NEXT_PUBLIC_BACKEND=firebase
  - [ ] NEXT_PUBLIC_FIREBASE_API_KEY
  - [ ] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  - [ ] NEXT_PUBLIC_FIREBASE_PROJECT_ID
  - [ ] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  - [ ] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  - [ ] NEXT_PUBLIC_FIREBASE_APP_ID
- [ ] Environment variables have no quotes
- [ ] Environment variables have no extra spaces
- [ ] Deployed AFTER adding variables
- [ ] Firebase services enabled (Auth, Firestore, Storage)
- [ ] No typos in variable names
- [ ] Using correct Firebase project

---

## 🎯 Example: Correct Setup

### In Firebase Console

```javascript
// Your Firebase config (from Project Settings)
const firebaseConfig = {
  apiKey: "AIzaSyBdX8yF9kQ-example-1234567890ABC",
  authDomain: "cogninote-prod.firebaseapp.com",
  projectId: "cogninote-prod",
  storageBucket: "cogninote-prod.appspot.com",
  messagingSenderId: "987654321012",
  appId: "1:987654321012:web:1a2b3c4d5e6f7890ab"
};
```

### In Netlify Environment Variables

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_BACKEND` | `firebase` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyBdX8yF9kQ-example-1234567890ABC` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `cogninote-prod.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `cogninote-prod` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `cogninote-prod.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `987654321012` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:987654321012:web:1a2b3c4d5e6f7890ab` |

---

## 🚀 Pro Tip: Use Vercel Instead

Vercel has better support for Next.js and environment variables:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables during setup
# Or add them in Vercel dashboard

# Deploy to production
vercel --prod
```

**Vercel Dashboard:** https://vercel.com/dashboard

Environment variables in Vercel are easier to manage!

---

## 📞 Need More Help?

### Debug Mode

Open your deployed site and check console:

```javascript
// You should see:
✅ Firebase configuration validated

// If you see errors:
❌ Missing Firebase environment variables: ...
❌ Invalid Firebase API key format
```

This will tell you exactly what's wrong!

### Check Network Tab

1. Open F12 → Network tab
2. Try to sign in
3. Look for Firebase API calls
4. Check if they're using the right API key

### Still Stuck?

1. Take a screenshot of:
   - Netlify environment variables (hide values)
   - Firebase console config page
   - Browser console errors
   
2. Double-check variable names (no typos!)

3. Try creating a brand new Firebase project

---

## 🎊 Summary

**Error:** `Firebase: Error (auth/invalid-api-key)`

**Cause:** Missing or incorrect API key

**Fix:**
1. ✅ Get correct API key from Firebase Console
2. ✅ Add/update in Netlify environment variables
3. ✅ Add ALL 7 Firebase variables
4. ✅ Redeploy site
5. ✅ Should work!

**Time:** 2-5 minutes

---

**Updated:** October 2025  
**For:** CogniNote Netlify Deployment
