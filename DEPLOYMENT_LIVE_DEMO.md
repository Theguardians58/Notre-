# 🚀 Deploy CogniNote Live Demo

**Quick Deploy**: Get your CogniNote live in 5 minutes!

---

## ⚡ Fastest: Deploy to Vercel (Recommended)

Vercel is made by the Next.js team and offers the best Next.js hosting.

### Method 1: One-Click Deploy (Easiest)

1. **Click the Deploy Button:**

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Theguardians58/Notre-)

2. **Connect GitHub:**
   - Click "Continue with GitHub"
   - Authorize Vercel
   - Select your repository: `Notre-`

3. **Configure Environment Variables:**
   
   You'll need Firebase credentials. Get them from [Firebase Console](https://console.firebase.google.com):

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your live URL: `https://notre-xxxx.vercel.app`

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd /workspace
vercel

# Follow prompts
# Link to existing project or create new
# Add environment variables when prompted
# Deploy!

# Your live URL will be shown
```

**Your live demo URL**: `https://your-project.vercel.app`

---

## 🌐 Alternative: Deploy to Netlify

### One-Click Netlify Deploy

1. **Click Deploy Button:**

   [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Theguardians58/Notre-)

2. **Connect GitHub** and select repository

3. **Configure Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18`

4. **Add Environment Variables:**
   - Settings → Environment Variables
   - Add all Firebase variables

5. **Deploy!**
   - Click "Deploy site"
   - Your URL: `https://your-app.netlify.app`

### Netlify CLI

```bash
# Install
npm i -g netlify-cli

# Login
netlify login

# Deploy
cd /workspace
netlify deploy --prod

# Follow prompts
# Your live URL will be shown
```

---

## 🔥 Option 3: Firebase Hosting

Since you're already using Firebase, host there too!

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize hosting (if not done)
cd /workspace
firebase init hosting

# Choose:
# - Use existing project (select your Firebase project)
# - Public directory: out
# - Configure as single-page app: Yes
# - Set up automatic builds: No (optional)

# Build for static export
npm run build

# Deploy
firebase deploy --only hosting

# Your URL: https://your-project.web.app
```

**Note**: Next.js 15 works best with Vercel. Firebase Hosting requires static export.

---

## 🎯 Quick Comparison

| Feature | Vercel | Netlify | Firebase |
|---------|--------|---------|----------|
| **Setup Time** | 2 min | 3 min | 5 min |
| **Next.js Support** | ⭐⭐⭐ | ⭐⭐ | ⭐ |
| **Free Tier** | Generous | Generous | Limited |
| **Auto Deploy** | ✅ | ✅ | ❌ |
| **Custom Domain** | ✅ Free | ✅ Free | ✅ Free |
| **Analytics** | ✅ Built-in | ✅ Built-in | ✅ Google Analytics |
| **Best For** | Next.js apps | Static sites | Firebase users |

**Recommended**: ⭐ **Vercel** for best Next.js experience

---

## 🔑 Setting Up Firebase (Required for All)

Before deploying, set up Firebase:

### 1. Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Enter name: "CogniNote" (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. Go to **Authentication** → Get Started
2. Enable **Email/Password**:
   - Sign-in method → Email/Password → Enable
3. Enable **Google**:
   - Sign-in method → Google → Enable
   - Add support email

### 3. Create Firestore Database

1. Go to **Firestore Database** → Create database
2. Start in **production mode**
3. Choose location (closest to users)
4. Click "Enable"

5. **Deploy Security Rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

### 4. Enable Storage

1. Go to **Storage** → Get Started
2. Start in **production mode**
3. Click "Done"

4. **Deploy Storage Rules**:
   ```bash
   firebase deploy --only storage
   ```

### 5. Get Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click **Web app** icon (</>)
4. Register app: "CogniNote Web"
5. Copy the **firebaseConfig** object

---

## 📝 Environment Variables

Copy these to your deployment platform:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxx
```

---

## 🎨 Custom Domain (Optional)

### On Vercel

1. Go to Project → Settings → Domains
2. Add your domain: `cogninote.com`
3. Add DNS records as shown
4. Wait for SSL certificate (automatic)

### On Netlify

1. Go to Site settings → Domain management
2. Add custom domain
3. Update DNS records
4. SSL auto-configured

### On Firebase

1. Go to Hosting → Add custom domain
2. Enter domain
3. Verify ownership
4. Update DNS
5. SSL auto-configured

---

## 🚀 Deploy Now - Step by Step

### Fastest Route: Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Navigate to project
cd /workspace

# 3. Deploy
vercel

# 4. Answer prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? cogninote (or your choice)
# - Directory? ./
# - Override settings? No

# 5. Add environment variables
# Vercel will prompt or use dashboard:
# https://vercel.com/your-name/cogninote/settings/environment-variables

# 6. Done! Your URL:
# https://cogninote-xxxx.vercel.app
```

### Get Production URL

```bash
# Deploy to production
vercel --prod

# Your production URL will be shown:
# https://cogninote.vercel.app
```

---

## 📊 Post-Deployment Checklist

After deploying, verify:

- [ ] Site loads at your URL
- [ ] Login page appears
- [ ] Can sign up with email
- [ ] Can sign in with Google
- [ ] Firebase connection works
- [ ] Can create notes
- [ ] Editor works
- [ ] Diagrams render
- [ ] Graph view loads
- [ ] Dark mode toggles
- [ ] Mobile responsive
- [ ] No console errors

---

## 🔧 Troubleshooting Deployment

### Issue: Build fails on Vercel

**Solution:**
1. Check build logs
2. Ensure all dependencies install
3. Verify `.npmrc` is committed
4. Check environment variables

### Issue: Firebase connection fails

**Solution:**
1. Verify all env variables are set
2. Check Firebase project is active
3. Verify API key is correct
4. Check browser console for errors

### Issue: "Module not found" errors

**Solution:**
1. Ensure all files are committed
2. Check import paths are correct
3. Verify `tsconfig.json` paths

### Issue: Blank page after deployment

**Solution:**
1. Check browser console
2. Verify Firebase config
3. Check environment variables
4. Look at deployment logs

---

## 🎯 Demo URL Examples

After deployment, you'll get URLs like:

**Vercel:**
- Preview: `https://notre-git-main-username.vercel.app`
- Production: `https://notre.vercel.app`
- Custom: `https://cogninote.com`

**Netlify:**
- Preview: `https://your-app-name.netlify.app`
- Custom: `https://cogninote.com`

**Firebase:**
- Default: `https://your-project.web.app`
- Custom: `https://your-project.firebaseapp.com`

---

## 📱 Share Your Demo

Once deployed, share:

```
🎉 Check out CogniNote - AI-Powered Note-Taking!

🔗 Live Demo: https://your-app.vercel.app

Features:
✅ Rich-text editor
✅ Visual diagrams
✅ End-to-end encryption
✅ AI integration
✅ Real-time collaboration
✅ Graph visualization

Built with Next.js, Firebase, and AI
```

---

## 🔒 Demo Account (Optional)

Create a demo account for testing:

**Email**: demo@cogninote.com  
**Password**: Demo123! (change after testing)

Or enable Google sign-in for easy access.

---

## 📊 Monitor Your Demo

### Vercel Analytics

- Go to Vercel dashboard
- View real-time analytics
- Monitor performance
- Check error logs

### Firebase Usage

- Firebase Console → Usage
- Monitor auth users
- Check database reads/writes
- Monitor storage usage

---

## 🎁 Free Tier Limits

### Vercel Free Tier
- 100 GB bandwidth/month
- Unlimited websites
- Automatic SSL
- GitHub integration
- Serverless functions

### Netlify Free Tier
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites
- Automatic SSL

### Firebase Free Tier (Spark)
- 50,000 reads/day
- 20,000 writes/day
- 1 GB storage
- 10 GB/month bandwidth
- 100 concurrent connections

**Upgrade if needed**: Vercel Pro ($20/month), Firebase Blaze (pay-as-you-go)

---

## ✅ Ready to Deploy!

Your CogniNote is configured and ready for deployment.

**Quick Start:**
```bash
vercel
```

**That's it!** You'll have a live demo URL in 2-3 minutes.

---

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Firebase Docs: https://firebase.google.com/docs/hosting
- GitHub Issues: https://github.com/Theguardians58/Notre-/issues

---

**Deploy now and get your live demo URL!** 🚀
