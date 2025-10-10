# 🔧 Netlify Deployment Error - Quick Fix Guide

**Error:** "Application error: a client-side exception has occurred"

This error occurs when environment variables are missing or when client-side code tries to access undefined configs.

---

## ⚡ Quick Fix (5 Minutes)

### Step 1: Add Environment Variables to Netlify

1. **Go to Netlify Dashboard**
   - https://app.netlify.com/
   - Select your site: `fancy-pothos-3c2eb5`

2. **Navigate to Environment Variables**
   - Site settings → Environment variables
   - Or: Build & deploy → Environment variables

3. **Add REQUIRED Variables**

**CRITICAL - Add these first:**

```env
# Backend Selection
NEXT_PUBLIC_BACKEND=firebase

# Firebase Configuration (REQUIRED if using Firebase)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**How to get Firebase credentials:**
- Go to: https://console.firebase.google.com/
- Select your project
- Click ⚙️ Settings → Project settings
- Scroll to "Your apps" → Web app
- Copy the config values

### Step 2: Redeploy

After adding environment variables:
1. Go to: Deploys tab
2. Click: "Trigger deploy" → "Clear cache and deploy site"
3. Wait for deployment to finish

---

## 🔍 Common Issues & Solutions

### Issue 1: Missing Environment Variables

**Symptom:** White screen or "client-side exception"

**Fix:**
```bash
# Check if .env.example exists
cat .env.example

# Copy values to Netlify environment variables
# Make sure ALL NEXT_PUBLIC_* variables are added
```

### Issue 2: Wrong Backend Configuration

**Symptom:** Can't connect to backend

**Fix in Netlify:**
```env
# Choose ONE backend:
NEXT_PUBLIC_BACKEND=firebase  # or appwrite or supabase
```

Then add the corresponding backend credentials.

### Issue 3: Build Configuration

**Symptom:** Build fails or runtime errors

**Fix in Netlify:**
1. Site settings → Build & deploy → Build settings
2. Set:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18 or higher

### Issue 4: Missing next.config.js

**Symptom:** 404 errors or routing issues

**Fix:** Ensure `next.config.js` exists in root:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
};

module.exports = nextConfig;
```

---

## 🛠️ Complete Environment Variables List

### Minimal Setup (Firebase)

```env
# Backend
NEXT_PUBLIC_BACKEND=firebase

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Full Setup (All Options)

```env
# Backend Selection
NEXT_PUBLIC_BACKEND=firebase

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Appwrite (Optional)
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT_ID=
NEXT_PUBLIC_APPWRITE_DATABASE_ID=
NEXT_PUBLIC_APPWRITE_NOTES_COLLECTION_ID=
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=
NEXT_PUBLIC_APPWRITE_BUCKET_ID=

# Supabase (Optional)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Google Cloud Storage (Optional)
NEXT_PUBLIC_GCS_BUCKET_NAME=
GCS_CREDENTIALS=

# AI Providers (Optional)
NEXT_PUBLIC_GEMINI_API_KEY=
NEXT_PUBLIC_OPENAI_API_KEY=
NEXT_PUBLIC_ANTHROPIC_API_KEY=
```

---

## 🚀 Step-by-Step Deployment

### 1. Prepare Locally

```bash
# Test build locally
npm run build

# If build fails, fix errors first
npm run dev  # Check console for errors
```

### 2. Create next.config.js

```bash
# Create if missing
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'storage.googleapis.com',
      'drive.google.com',
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
EOF
```

### 3. Add netlify.toml

```bash
cat > netlify.toml << 'EOF'
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
EOF
```

### 4. Commit and Push

```bash
git add next.config.js netlify.toml
git commit -m "fix: Add Netlify deployment configuration"
git push origin main
```

### 5. Configure Netlify

1. Add environment variables (see above)
2. Set build settings
3. Trigger redeploy

---

## 🐛 Debugging Steps

### Check Browser Console

1. Open deployed site
2. Press F12 → Console tab
3. Look for errors:

**Common errors:**

```
❌ "Firebase: Error (auth/invalid-api-key)"
→ Fix: Add NEXT_PUBLIC_FIREBASE_API_KEY

❌ "Cannot read property 'config' of undefined"
→ Fix: Check backend configuration

❌ "Network request failed"
→ Fix: Check CORS settings in Firebase/Appwrite
```

### Check Netlify Build Log

1. Deploys → Latest deploy → Deploy log
2. Look for:
   - ✅ Build successful
   - ❌ Missing dependencies
   - ❌ TypeScript errors

### Test Environment Variables

Add this to a page temporarily:

```tsx
console.log('Backend:', process.env.NEXT_PUBLIC_BACKEND);
console.log('Firebase API Key exists:', !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Environment variables added to Netlify
- [ ] Build command: `npm run build`
- [ ] Publish directory: `.next`
- [ ] Node version: 18+
- [ ] Site deploys without errors
- [ ] Homepage loads (might redirect to /auth/login)
- [ ] Can sign up/login
- [ ] Can create notes
- [ ] No console errors

---

## 🔄 Alternative: Use Vercel Instead

Netlify requires manual Next.js plugin setup. Vercel has native Next.js support:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_BACKEND
# ... add all other variables

# Deploy production
vercel --prod
```

**Vercel advantages:**
- Native Next.js support
- Automatic configuration
- Better performance
- Easier setup

---

## 📞 Still Having Issues?

### Quick Test: Deploy to Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy (will ask questions)
vercel

# 4. Add env vars in Vercel dashboard
# https://vercel.com/dashboard → Your project → Settings → Environment Variables

# 5. Deploy production
vercel --prod
```

### Check Logs

**Netlify:**
- Site overview → Functions → View logs
- Deploys → Deploy log

**Vercel:**
- Dashboard → Your project → Logs
- Real-time function logs

---

## 🎯 Most Likely Issue

**90% of Netlify errors = Missing environment variables**

**Quick fix:**
1. Copy `.env.example` values
2. Add to Netlify environment variables
3. Redeploy
4. ✅ Should work!

---

**Last Updated:** October 2025  
**For:** CogniNote Netlify Deployment
