# 🌐 CogniNote - Get Your Live Demo URL Now!

**Status**: ✅ Ready to Deploy  
**Time**: 2-5 minutes  
**Cost**: FREE

---

## 🚀 Quick Deploy (Choose One)

### Option 1: Vercel (Recommended - 2 minutes) ⭐

**One-Click Deploy:**

👉 **Click here**: https://vercel.com/new/clone?repository-url=https://github.com/Theguardians58/Notre-

**Or use CLI:**
```bash
npm i -g vercel
vercel login
vercel --prod
```

**Your live URL**: `https://notre-[random].vercel.app`

---

### Option 2: Netlify (3 minutes)

**One-Click Deploy:**

👉 **Click here**: https://app.netlify.com/start/deploy?repository=https://github.com/Theguardians58/Notre-

**Or use CLI:**
```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod
```

**Your live URL**: `https://[site-name].netlify.app`

---

## 🔑 Firebase Setup (Required - 5 minutes)

You MUST set up Firebase first for your app to work:

### Quick Firebase Setup

1. **Create Project**
   - Go to: https://console.firebase.google.com
   - Click: "Add project"
   - Name: "CogniNote-Demo"
   - Click: "Create project"

2. **Enable Authentication**
   - Build → Authentication → Get started
   - Enable "Email/Password"
   - Enable "Google"
   - Add your support email

3. **Create Firestore**
   - Build → Firestore Database → Create database
   - Start in production mode
   - Choose location
   - Click: "Enable"

4. **Enable Storage**
   - Build → Storage → Get started
   - Start in production mode
   - Click: "Done"

5. **Get Config**
   - Project Settings (gear icon)
   - Scroll to "Your apps"
   - Click </> (Web)
   - Copy firebaseConfig

6. **Deploy Rules**
   ```bash
   # In your local workspace
   firebase login
   firebase deploy --only firestore:rules
   firebase deploy --only storage
   ```

---

## 🔧 Add Environment Variables

### On Vercel

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add each variable:

```
NEXT_PUBLIC_FIREBASE_API_KEY = your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 123456789012
NEXT_PUBLIC_FIREBASE_APP_ID = 1:123456789012:web:xxxx
```

5. Redeploy: Deployments → Click ⋯ → Redeploy

### On Netlify

1. Site settings → Environment variables
2. Add each variable
3. Trigger new deploy

---

## ✅ Verification

After deployment, test:

1. **Visit your live URL**
2. **Sign up** with test email
3. **Create a note**
4. **Test editor** formatting
5. **Try dark mode**
6. **Test on mobile** (responsive)

---

## 🎯 Your Live URLs

After deployment, you'll get:

**Production URL** (Vercel):
```
https://notre.vercel.app
```

**Or with custom name**:
```
https://cogninote.vercel.app
```

**Or custom domain**:
```
https://cogninote.com
```

---

## 📱 Share Your Demo

Share your live demo:

```
🧠 CogniNote - AI-Powered Note-Taking

Try it live: https://your-app.vercel.app

✨ Features:
• Rich-text editor
• Visual diagrams
• End-to-end encryption  
• AI integration
• Real-time collaboration
• Graph visualization

100% free and open-source!
GitHub: https://github.com/Theguardians58/Notre-
```

---

## ⚡ Deploy NOW

**Fastest way**:

```bash
vercel
```

**That's it!** Your live demo URL will appear in 2-3 minutes.

---

**Need help?** See `DEPLOYMENT_LIVE_DEMO.md` for detailed guide.

**Repository**: https://github.com/Theguardians58/Notre-
