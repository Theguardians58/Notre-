# 🚀 Quick Start Guide

## Get Your Repository on GitHub in 5 Minutes

### Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click the **+** icon → **New repository**
3. Fill in:
   - **Repository name**: `cogninote`
   - **Description**: `AI-Powered Note-Taking with Diagrams and E2E Encryption`
   - **Visibility**: Public or Private
   - **DO NOT** check "Initialize with README"
4. Click **Create repository**

### Step 2: Connect and Push

Copy the URL from GitHub (it looks like `https://github.com/YOUR_USERNAME/cogninote.git`)

Then run:

```bash
cd /workspace

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/cogninote.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**That's it!** Your repository is now on GitHub! 🎉

---

## Alternative: Use SSH

If you prefer SSH:

```bash
cd /workspace

# Add remote (SSH)
git remote add origin git@github.com:YOUR_USERNAME/cogninote.git

# Push
git branch -M main
git push -u origin main
```

---

## What's Next?

### 1. **Set Repository Details**

On GitHub, add:
- Description
- Website URL (if deployed)
- Topics: `notes`, `ai`, `encryption`, `diagrams`, `nextjs`, `firebase`

### 2. **Deploy to Vercel**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Click "Deploy" button
2. Import your GitHub repository
3. Add environment variables (Firebase config)
4. Deploy!

### 3. **Add Badges to README**

```markdown
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-2.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
```

### 4. **Enable GitHub Features**

- **Issues**: For bug tracking
- **Discussions**: For community
- **Wiki**: For documentation
- **Actions**: For CI/CD

---

## Local Development

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your Firebase credentials to .env.local

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Enable:
   - Authentication (Email + Google)
   - Firestore Database
   - Storage
4. Get config from Project Settings
5. Add to `.env.local`

---

## Deploy to Vercel

### Via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY

# Deploy to production
vercel --prod
```

### Via Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Import repository
3. Configure:
   - Framework: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`
4. Add environment variables
5. Deploy!

---

## Collaborating

### Invite Contributors

1. Go to Settings → Collaborators
2. Add people by username/email
3. They can now push to your repo

### Set Up Branch Protection

1. Settings → Branches
2. Add rule for `main`
3. Require:
   - Pull request reviews
   - Status checks to pass
   - Up-to-date branches

---

## Tags & Releases

### Create a Release

```bash
# Tag current version
git tag -a v2.1.0 -m "CogniNote v2.1.0 - Full responsive design"

# Push tag
git push origin v2.1.0

# Or push all tags
git push --tags
```

### On GitHub

1. Go to Releases
2. Click "Create a new release"
3. Choose tag: `v2.1.0`
4. Title: "CogniNote v2.1.0"
5. Describe changes
6. Attach files (optional)
7. Publish!

---

## Share Your Project

### Social Media

```
🎉 Just released CogniNote v2.1!

AI-powered note-taking with:
📝 Rich-text editor
📊 Visual diagrams
🔐 E2E encryption
📱 Fully responsive

Built with Next.js, Firebase & TypeScript

Check it out: https://github.com/YOUR_USERNAME/cogninote

#OpenSource #WebDev #NextJS #AI
```

### Product Hunt

1. Submit to [Product Hunt](https://www.producthunt.com/posts/new)
2. Add screenshots
3. Write description
4. Launch!

### Dev.to / Hashnode

Write a blog post about:
- Why you built it
- Technical challenges
- Architecture decisions
- Lessons learned

---

## Get Stars ⭐

Tips for getting GitHub stars:

1. **Great README**
   - Clear description
   - Screenshots/GIFs
   - Easy setup instructions

2. **Documentation**
   - API docs
   - Tutorials
   - Examples

3. **Showcase**
   - Live demo
   - Video walkthrough
   - Blog posts

4. **Engage**
   - Respond to issues
   - Review PRs
   - Help users

5. **Promote**
   - Share on Twitter
   - Reddit (r/webdev, r/nextjs)
   - Dev.to articles
   - YouTube tutorial

---

## Support

- 📧 Email: developer@cogninote.app
- 💬 Discussions: GitHub Discussions
- 🐛 Bugs: GitHub Issues
- 📖 Docs: GitHub Wiki

---

**Happy Coding!** 🚀

**Star the repo if you find it useful!** ⭐
