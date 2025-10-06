# 🚀 Moving CogniNote to a New Repository

## Quick Migration Guide

Follow these steps to move CogniNote to a clean new repository.

---

## Option 1: Automated Migration (Recommended)

Run this script to clean up and prepare for migration:

```bash
# Navigate to workspace
cd /workspace

# Remove old e-commerce files
rm -rf app/product
rm -rf app/search
rm -rf app/\[page\]
rm -rf components/cart
rm -rf components/product
rm -rf components/grid
rm -rf components/layout/navbar
rm -rf components/layout/search
rm -rf components/layout/footer.tsx
rm -rf components/layout/footer-menu.tsx
rm -rf components/layout/product-grid-items.tsx
rm -rf lib/shopify
rm -f components/carousel.tsx
rm -f components/label.tsx
rm -f components/loading-dots.tsx
rm -f components/logo-square.tsx
rm -f components/opengraph-image.tsx
rm -f components/price.tsx
rm -f components/prose.tsx
rm -f components/welcome-toast.tsx
rm -f lib/constants.ts
rm -f lib/type-guards.ts
rm -f lib/utils.ts
rm -f app/robots.ts
rm -f app/sitemap.ts
rm -f app/api/revalidate/route.ts

# Remove old license
rm -f license.md

# Initialize new git repository
rm -rf .git
git init
git add .
git commit -m "Initial commit: CogniNote v2.1 - AI-Powered Note-Taking App

Features:
- Rich-text editor with Tiptap
- Visual diagrams (Flowcharts, Mindmaps, Whiteboard, Mermaid)
- End-to-end encryption (AES-256-GCM)
- AI integration (Gemini, OpenAI, Anthropic)
- Fully responsive (Mobile, Tablet, Desktop)
- Firebase backend (Firestore, Auth, Storage)
- Dark mode support
- Real-time sync
- PWA ready"

echo "Repository cleaned and ready!"
```

---

## Option 2: Manual Migration

### Step 1: Create New Repository on GitHub/GitLab

1. Go to GitHub.com (or GitLab)
2. Click "New Repository"
3. Name: `cogninote` (or your preferred name)
4. Description: "AI-Powered Note-Taking with Diagrams and E2E Encryption"
5. **Don't** initialize with README (we already have one)
6. Click "Create Repository"

### Step 2: Clean Current Workspace

Remove old template files:

```bash
cd /workspace

# Remove e-commerce components
rm -rf app/product app/search app/\[page\]
rm -rf components/cart components/product components/grid
rm -rf components/layout/navbar components/layout/search
rm -rf lib/shopify

# Remove unused files
rm -f components/{carousel,label,loading-dots,logo-square,opengraph-image,price,prose,welcome-toast}.tsx
rm -f components/layout/{footer,footer-menu,product-grid-items}.tsx
rm -f lib/{constants,type-guards,utils}.ts
rm -f app/{robots,sitemap}.ts
rm -rf app/api/revalidate
rm -f license.md
```

### Step 3: Initialize Git

```bash
# Remove old git history
rm -rf .git

# Initialize new repository
git init

# Add all CogniNote files
git add .

# Create initial commit
git commit -m "Initial commit: CogniNote v2.1"
```

### Step 4: Connect to Remote

```bash
# Add your remote repository (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/cogninote.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Option 3: Fresh Clone Approach

### Step 1: Create Clean Directory

```bash
# Create new directory
mkdir cogninote-clean
cd cogninote-clean

# Initialize git
git init
```

### Step 2: Copy CogniNote Files

```bash
# Copy from workspace (adjust source path as needed)
cp -r /workspace/app ./
cp -r /workspace/components ./
cp -r /workspace/lib ./
cp -r /workspace/hooks ./
cp -r /workspace/fonts ./
cp /workspace/package.json ./
cp /workspace/next.config.ts ./
cp /workspace/tsconfig.json ./
cp /workspace/postcss.config.mjs ./
cp /workspace/tailwind.config.ts ./
cp /workspace/.env.example ./
cp /workspace/README.md ./
cp /workspace/*.md ./

# Remove old template files
rm -rf components/cart components/product components/grid
rm -rf components/layout/navbar components/layout/search
rm -rf lib/shopify
# ... (see cleanup commands above)

# Add and commit
git add .
git commit -m "Initial commit: CogniNote v2.1"
```

---

## 📁 Files to Keep (CogniNote Core)

### Application Files ✅
```
app/
├── auth/
│   ├── login/page.tsx
│   └── signup/page.tsx
├── dashboard/page.tsx
├── note/[id]/
│   ├── page.tsx
│   └── DiagramPage.tsx
├── settings/
│   ├── page.tsx
│   └── encryption/page.tsx
├── layout.tsx
├── page.tsx
├── globals.css
├── favicon.ico
└── manifest.json
```

### Components ✅
```
components/
├── ai/
│   └── AIAssistModal.tsx
├── auth/
│   └── AuthGuard.tsx
├── diagrams/
│   ├── DiagramSelector.tsx
│   ├── FlowchartEditor.tsx
│   ├── MermaidViewer.tsx
│   ├── MindmapEditor.tsx
│   └── WhiteboardEditor.tsx
├── editor/
│   ├── EditorToolbar.tsx
│   ├── SlashCommands.tsx
│   ├── SlashCommandsList.tsx
│   ├── TiptapEditor.tsx
│   └── editor.css
├── encryption/
│   ├── EncryptionSetup.tsx
│   ├── EncryptionStatus.tsx
│   └── EncryptionUnlock.tsx
├── layout/
│   ├── MobileHeader.tsx
│   ├── MobileSidebar.tsx
│   ├── SearchModal.tsx
│   ├── Sidebar.tsx
│   └── ThemeToggle.tsx
└── ui/
    ├── Button.tsx
    ├── Input.tsx
    ├── Modal.tsx
    ├── ResponsiveModal.tsx
    └── Spinner.tsx
```

### Libraries ✅
```
lib/
├── ai/
│   └── providers.ts
├── crypto/
│   └── encryption.ts
├── firebase/
│   ├── auth.ts
│   ├── config.ts
│   ├── encryption-notes.ts
│   ├── notes.ts
│   ├── settings.ts
│   └── storage.ts
├── store/
│   ├── useAuthStore.ts
│   ├── useEncryptionStore.ts
│   ├── useNotesStore.ts
│   └── useUIStore.ts
├── search.ts
├── templates.ts
└── types.ts
```

### Hooks ✅
```
hooks/
├── useAuth.ts
├── useNotes.ts
└── useTheme.ts
```

### Configuration ✅
```
package.json
next.config.ts
tsconfig.json
postcss.config.mjs
.env.example
```

### Documentation ✅
```
README.md
SETUP_CHECKLIST.md
ENCRYPTION_GUIDE.md
FEATURES_SUMMARY.md
KNOWN_ISSUES_AND_FIXES.md
PROJECT_SUMMARY.md
ERROR_CHECK_REPORT.md
WHATS_NEW.md
RESPONSIVE_DESIGN_GUIDE.md
MOBILE_OPTIMIZATION_SUMMARY.md
```

---

## 🗑️ Files to Remove (Old Template)

```
# Old e-commerce pages
app/product/
app/search/
app/[page]/
app/api/revalidate/

# Old e-commerce components
components/cart/
components/product/
components/grid/
components/layout/navbar/
components/layout/search/
components/layout/footer.tsx
components/layout/footer-menu.tsx
components/layout/product-grid-items.tsx

# Old e-commerce utilities
lib/shopify/
lib/constants.ts
lib/type-guards.ts
lib/utils.ts

# Old template files
components/carousel.tsx
components/label.tsx
components/loading-dots.tsx
components/logo-square.tsx
components/opengraph-image.tsx
components/price.tsx
components/prose.tsx
components/welcome-toast.tsx

# Old configuration
app/robots.ts
app/sitemap.ts
license.md
pnpm-lock.yaml (if not using pnpm)
```

---

## 🔧 Post-Migration Setup

### 1. Update package.json

Ensure your package.json has correct information:

```json
{
  "name": "cogninote",
  "version": "2.1.0",
  "description": "AI-Powered Note-Taking with Diagrams and E2E Encryption",
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/cogninote.git"
  }
}
```

### 2. Create .gitignore

```bash
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/

# Production
dist/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# Firebase
.firebase/
firebase-debug.log
firestore-debug.log
EOF
```

### 3. Create LICENSE

```bash
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2025 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
```

### 4. Create CONTRIBUTING.md

```markdown
# Contributing to CogniNote

Thank you for your interest in contributing!

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Submit a pull request

## Development Setup

See README.md for setup instructions.

## Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Add comments for complex logic
- Test on mobile and desktop

## Pull Request Process

1. Update README if needed
2. Test all features
3. Ensure no console errors
4. Write clear commit messages
```

---

## 📤 Pushing to GitHub

### Via HTTPS

```bash
git remote add origin https://github.com/YOUR_USERNAME/cogninote.git
git branch -M main
git push -u origin main
```

### Via SSH

```bash
git remote add origin git@github.com:YOUR_USERNAME/cogninote.git
git branch -M main
git push -u origin main
```

---

## 🏷️ Tagging Releases

```bash
# Tag current version
git tag -a v2.1.0 -m "CogniNote v2.1.0 - Full responsive design"

# Push tags
git push origin --tags
```

---

## 📋 Verification Checklist

After migration, verify:

- [ ] All CogniNote files present
- [ ] No old e-commerce files
- [ ] package.json updated
- [ ] .gitignore created
- [ ] README.md present
- [ ] All documentation files included
- [ ] Git initialized
- [ ] Remote connected
- [ ] Pushed to GitHub/GitLab
- [ ] Repository is public/private as intended
- [ ] License file present

---

## 🎯 Next Steps

1. **Set up GitHub Actions** (optional)
   - Add CI/CD pipeline
   - Automated testing
   - Deployment to Vercel

2. **Add Badges to README**
   ```markdown
   ![Build Status](https://github.com/YOUR_USERNAME/cogninote/workflows/CI/badge.svg)
   ![License](https://img.shields.io/badge/license-MIT-blue.svg)
   ![Version](https://img.shields.io/badge/version-2.1.0-green.svg)
   ```

3. **Create GitHub Issues**
   - Label issues (bug, feature, enhancement)
   - Create milestones
   - Set up project boards

4. **Documentation**
   - GitHub Wiki
   - GitHub Pages for docs
   - Video tutorials

---

## 🆘 Troubleshooting

### Issue: Git push rejected

**Solution**: Force push (only if you're sure)
```bash
git push -f origin main
```

### Issue: Too large files

**Solution**: Use Git LFS for large files
```bash
git lfs install
git lfs track "*.png" "*.jpg"
```

### Issue: Wrong remote URL

**Solution**: Update remote
```bash
git remote set-url origin NEW_URL
```

---

## ✅ Success!

Your CogniNote repository is now clean and ready for collaboration!

**Share your repository:**
```
https://github.com/YOUR_USERNAME/cogninote
```

---

**Happy Coding!** 🚀
