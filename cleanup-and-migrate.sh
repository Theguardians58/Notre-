#!/bin/bash

# CogniNote Repository Cleanup Script
# This script removes old e-commerce template files and prepares a clean repository

echo "🧹 Starting CogniNote repository cleanup..."
echo ""

# Navigate to workspace
cd /workspace || exit 1

# Remove old e-commerce pages
echo "📁 Removing old e-commerce pages..."
rm -rf app/product
rm -rf app/search
rm -rf app/\[page\]
rm -rf app/api/revalidate

# Remove old e-commerce components
echo "🗑️  Removing old e-commerce components..."
rm -rf components/cart
rm -rf components/product
rm -rf components/grid
rm -rf components/layout/navbar
rm -rf components/layout/search

# Remove unused component files
echo "🗑️  Removing unused files..."
rm -f components/carousel.tsx
rm -f components/label.tsx
rm -f components/loading-dots.tsx
rm -f components/logo-square.tsx
rm -f components/opengraph-image.tsx
rm -f components/price.tsx
rm -f components/prose.tsx
rm -f components/welcome-toast.tsx
rm -f components/layout/footer.tsx
rm -f components/layout/footer-menu.tsx
rm -f components/layout/product-grid-items.tsx

# Remove old libraries
echo "📚 Removing old libraries..."
rm -rf lib/shopify
rm -f lib/constants.ts
rm -f lib/type-guards.ts
rm -f lib/utils.ts

# Remove old app files
rm -f app/robots.ts
rm -f app/sitemap.ts
rm -f app/opengraph-image.tsx
rm -f app/error.tsx

# Remove old license
rm -f license.md

# Remove package manager lock files (keep only one)
echo "🔒 Cleaning up lock files..."
rm -f pnpm-lock.yaml  # Remove if not using pnpm
# Keep package-lock.json if using npm, or yarn.lock if using yarn

echo ""
echo "✅ Cleanup complete!"
echo ""

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    echo "📝 Creating .gitignore..."
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
fi

# Create LICENSE if it doesn't exist
if [ ! -f LICENSE ]; then
    echo "📄 Creating LICENSE (MIT)..."
    cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2025 CogniNote

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
fi

echo ""
echo "📊 Repository Summary:"
echo "====================="
echo ""

# Count files by type
echo "📝 TypeScript files: $(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | wc -l)"
echo "📚 Documentation files: $(find . -name "*.md" | wc -l)"
echo "⚙️  Configuration files: $(find . -maxdepth 1 -name "*.json" -o -name "*.ts" -o -name "*.mjs" | wc -l)"
echo ""

# Show directory structure
echo "📁 Clean directory structure:"
echo ""
ls -la app/ 2>/dev/null | grep "^d" | awk '{print "   app/" $9}' | grep -v "^\.$" | grep -v "^\.\.$"
ls -la components/ 2>/dev/null | grep "^d" | awk '{print "   components/" $9}' | grep -v "^\.$" | grep -v "^\.\.$"
echo ""

echo "✨ Repository is now clean and ready for migration!"
echo ""
echo "📋 Next steps:"
echo "   1. Review the changes"
echo "   2. Initialize git: rm -rf .git && git init"
echo "   3. Add files: git add ."
echo "   4. Commit: git commit -m 'Initial commit: CogniNote v2.1'"
echo "   5. Add remote: git remote add origin YOUR_REPO_URL"
echo "   6. Push: git push -u origin main"
echo ""
echo "📖 See MIGRATION_GUIDE.md for detailed instructions"
echo ""
