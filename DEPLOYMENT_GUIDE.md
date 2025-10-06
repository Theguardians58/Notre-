# 🚀 Deployment Guide - CogniNote

## Quick Deploy Options

CogniNote can be deployed to various platforms. Here are the most popular options:

---

## 🟢 Option 1: Vercel (Recommended)

### Why Vercel?
- ✅ Built for Next.js
- ✅ Zero configuration
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Edge functions
- ✅ Preview deployments

### Deploy Steps

#### Via GitHub Integration (Easiest)

1. **Push to GitHub** (if not already done)
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/cogninote.git
   git push -u origin main
   ```

2. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure**
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Add Environment Variables**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

5. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

#### Via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY

# Deploy to production
vercel --prod
```

Your app will be at: `https://cogninote.vercel.app`

---

## 🔵 Option 2: Netlify

### Deploy Steps

1. **Build Configuration**
   
   Create `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. **Deploy via GitHub**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect GitHub
   - Select repository
   - Add environment variables
   - Deploy!

3. **Or via CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod
   ```

---

## 🔴 Option 3: Firebase Hosting

### Deploy Steps

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login**
   ```bash
   firebase login
   ```

3. **Initialize**
   ```bash
   firebase init hosting
   ```
   
   Select:
   - Existing project (your Firebase project)
   - Public directory: `out`
   - Single-page app: Yes
   - Automatic builds: No

4. **Update `next.config.ts`**
   ```typescript
   export default {
     output: 'export',
     images: {
       unoptimized: true,
     },
     // ... rest of config
   };
   ```

5. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

Your app: `https://YOUR_PROJECT.web.app`

---

## 🟣 Option 4: AWS Amplify

### Deploy Steps

1. **Go to AWS Amplify Console**
   - Visit [console.aws.amazon.com/amplify](https://console.aws.amazon.com/amplify)

2. **Connect Repository**
   - Click "New app" → "Host web app"
   - Connect GitHub
   - Select repository

3. **Configure Build**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

4. **Add Environment Variables**

5. **Deploy!**

---

## 🟠 Option 5: Docker + Cloud Run

### Dockerfile

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Deploy to Google Cloud Run

```bash
# Build
docker build -t cogninote .

# Tag
docker tag cogninote gcr.io/YOUR_PROJECT/cogninote

# Push
docker push gcr.io/YOUR_PROJECT/cogninote

# Deploy
gcloud run deploy cogninote \
  --image gcr.io/YOUR_PROJECT/cogninote \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🔧 Environment Variables Setup

### Required Variables

All deployment platforms need these:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### How to Add

**Vercel:**
```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
```

**Netlify:**
Site Settings → Environment Variables

**Firebase:**
Not needed (using Firebase already)

**AWS:**
Amplify Console → Environment variables

---

## 📊 Performance Optimization

### Before Production

1. **Enable Compression**
   ```typescript
   // next.config.ts
   export default {
     compress: true,
     // ...
   };
   ```

2. **Image Optimization**
   - Use Next.js Image component
   - Enable Vercel Image Optimization
   - Or use Cloudinary/imgix

3. **Bundle Analysis**
   ```bash
   npm install @next/bundle-analyzer
   ```
   
   ```typescript
   // next.config.ts
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   });
   
   module.exports = withBundleAnalyzer({
     // config
   });
   ```

4. **Enable Analytics**
   - Vercel Analytics
   - Google Analytics
   - Plausible Analytics

---

## 🔒 Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env.local`
- ✅ Use platform environment variables
- ✅ Rotate API keys regularly

### 2. Firebase Security Rules
- ✅ Review and test rules
- ✅ Enable App Check
- ✅ Set up billing alerts

### 3. HTTPS
- ✅ All platforms provide HTTPS automatically
- ✅ Enforce HTTPS redirects

### 4. CSP Headers
Add to `next.config.ts`:
```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
      ],
    },
  ];
}
```

---

## 📈 Monitoring

### Recommended Tools

1. **Vercel Analytics**
   - Built-in for Vercel
   - Real user monitoring
   - Core Web Vitals

2. **Sentry**
   - Error tracking
   - Performance monitoring
   ```bash
   npm install @sentry/nextjs
   ```

3. **Firebase Performance**
   - Already integrated
   - Automatic monitoring

4. **Google Analytics**
   ```bash
   npm install @next/third-parties
   ```

---

## 🚀 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          # ... other env vars
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🌍 Custom Domain

### Vercel

1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Netlify

1. Domain Settings → Add domain
2. Update DNS:
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

---

## ✅ Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Firebase security rules updated
- [ ] Firebase Storage rules updated
- [ ] .gitignore includes .env files
- [ ] Build succeeds locally (`npm run build`)
- [ ] All tests pass (if applicable)
- [ ] No console errors in production build
- [ ] Images optimized
- [ ] Meta tags configured
- [ ] Favicon added
- [ ] Manifest.json configured
- [ ] Analytics configured
- [ ] Error tracking configured
- [ ] Custom domain configured (optional)

---

## 🆘 Troubleshooting

### Build Fails

**Check:**
- Node version (should be 18+)
- All dependencies installed
- Environment variables set
- TypeScript errors
- Build logs

### App Crashes

**Check:**
- Server logs
- Browser console
- Sentry errors
- Firebase quota
- API limits

### Slow Performance

**Check:**
- Bundle size
- Image sizes
- API response times
- Database queries
- Caching strategy

---

## 📞 Support

- 📖 [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- 📖 [Vercel Docs](https://vercel.com/docs)
- 📖 [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)

---

**Your app is ready for the world!** 🌍🚀
